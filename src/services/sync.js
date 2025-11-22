import * as firebase from './firebaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteClient,
  deleteOrder,
  deleteProduct,
  getClientsUpdatedSince,
  getOrdersUpdatedSince,
  getProductsUpdatedSince,
  saveClient,
  saveOrderRecord,
  saveProduct,
  getClientById,
  getProductById,
  getOrderById,
} from '../database';
import { clientRepository, productRepository, orderRepository } from '../database/repository';

const LAST_SYNCED_AT_KEY = 'last_synced_at';

const toDate = (timestamp) => (timestamp ? new Date(timestamp) : new Date());

async function pullChanges(userId, lastSyncedAt) {
  console.log('Pulling changes...');
  const since = lastSyncedAt || 0;

  const remoteClients = (await firebase.getFBUpdatedClients(userId, since)) || {};
  const remoteProducts = (await firebase.getFBUpdatedProducts(userId, since)) || {};
  const remoteOrders = (await firebase.getFBUpdatedOrders(userId, since)) || {};

  for (const [clientId, remoteClient] of Object.entries(remoteClients)) {
    const localClient = await clientRepository.getById(clientId);

    if (remoteClient._status === 'deleted') {
      if (localClient) await clientRepository.remove(clientId);
      continue;
    }

    const updatedAt = toDate(remoteClient.updated_at);
    const localUpdatedAt = localClient?.updatedAt?.getTime?.() || 0;

    if (!localClient || localUpdatedAt < updatedAt.getTime()) {
      await clientRepository.save({
        _id: clientId,
        name: remoteClient.name || '',
        phone: remoteClient.phone || null,
        email: remoteClient.email || null,
        address: remoteClient.address || null,
        createdAt: remoteClient.created_at ? toDate(remoteClient.created_at) : updatedAt,
        updatedAt,
      });
    }
  }

  for (const [productId, remoteProduct] of Object.entries(remoteProducts)) {
    const localProduct = await productRepository.getById(productId);

    if (remoteProduct._status === 'deleted') {
      if (localProduct) await productRepository.remove(productId);
      continue;
    }

    const updatedAt = toDate(remoteProduct.updated_at);
    const localUpdatedAt = localProduct?.updatedAt?.getTime?.() || 0;

    if (!localProduct || localUpdatedAt < updatedAt.getTime()) {
      await productRepository.save({
        _id: productId,
        name: remoteProduct.name || '',
        description: remoteProduct.description || null,
        price: Number(remoteProduct.price) || 0,
        quantity: Number(remoteProduct.quantity) || 0,
        createdAt: remoteProduct.created_at ? toDate(remoteProduct.created_at) : updatedAt,
        updatedAt,
      });
    }
  }

  for (const [orderId, remoteOrder] of Object.entries(remoteOrders)) {
    const clientIdentifier = remoteOrder.clientId || remoteOrder.client_id;
    if (!clientIdentifier) continue;

    const localOrder = await orderRepository.getById(orderId);

    if (remoteOrder._status === 'deleted') {
      if (localOrder) await orderRepository.remove(orderId);
      continue;
    }

    const updatedAt = toDate(remoteOrder.updated_at);
    const localUpdatedAt = localOrder?.updatedAt?.getTime?.() || 0;

    if (!localOrder || localUpdatedAt < updatedAt.getTime()) {
      const productsRemote = Array.isArray(remoteOrder.products)
        ? remoteOrder.products
        : Object.values(remoteOrder.products || {});

      if (productsRemote.length > 0) {
        await orderRepository.updateWithProducts({
          _id: orderId,
          clientId: clientIdentifier,
          status: remoteOrder.status || localOrder?.status || 'pending',
          products: productsRemote.map((p) => ({
            productId: p.productId || p.id || p._id,
            quantity: Number(p.quantity) || 0,
            unitPrice: Number(p.unitPrice ?? p.price) || 0,
          })),
          orderDate: remoteOrder.orderDate ? toDate(remoteOrder.orderDate) : updatedAt,
        });
      } else {
        await orderRepository.saveRecord({
          _id: orderId,
          clientId: clientIdentifier,
          status: remoteOrder.status || localOrder?.status || 'pending',
          totalAmount: Number(remoteOrder.totalAmount) || localOrder?.totalAmount || 0,
          orderDate: remoteOrder.orderDate ? toDate(remoteOrder.orderDate) : updatedAt,
          updatedAt,
        });
      }
    }
  }
}

const serializeClient = (client) => ({
  id: client._id,
  name: client.name,
  phone: client.phone || '',
  updated_at: client.updatedAt ? client.updatedAt.getTime() : Date.now(),
  _status: 'updated',
});

const serializeProduct = (product) => ({
  id: product._id,
  name: product.name,
  price: product.price,
  quantity: product.quantity || 0,
  updated_at: product.updatedAt ? product.updatedAt.getTime() : Date.now(),
  _status: 'updated',
});

const serializeOrder = (order, items = []) => ({
  id: order._id,
  client_id: order.clientId || '',
  status: order.status,
  totalAmount: order.totalAmount || 0,
  orderDate: order.orderDate ? order.orderDate.getTime?.() || order.orderDate : undefined,
  products: items.map((it) => ({
    productId: it.productId,
    quantity: it.quantity,
    unitPrice: it.unitPrice,
  })),
  updated_at: order.updatedAt ? order.updatedAt.getTime() : Date.now(),
  _status: 'updated',
});

async function pushChanges(userId, lastSyncedAt) {
  console.log('Pushing changes...');
  const sinceDate = new Date(lastSyncedAt || 0);

  const updatedClients = await clientRepository.updatedSince(sinceDate.getTime());
  for (const client of updatedClients) {
    await firebase.upsertClient(userId, serializeClient(client));
  }

  const updatedProducts = await productRepository.updatedSince(sinceDate.getTime());
  for (const product of updatedProducts) {
    await firebase.upsertProduct(userId, serializeProduct(product));
  }

  const updatedOrders = await orderRepository.updatedSince(sinceDate.getTime());
  for (const order of updatedOrders) {
    const items = await orderRepository.getItems(order._id);
    await firebase.upsertOrder(userId, serializeOrder(order, items));
  }
}

export async function synchronize(userId) {
  try {
    const lastSyncedAt = await AsyncStorage.getItem(LAST_SYNCED_AT_KEY);
    const lastSyncedAtTime = lastSyncedAt ? parseInt(lastSyncedAt, 10) : 0;

    console.log(`Starting sync for user ${userId}. Last sync: ${new Date(lastSyncedAtTime)}`);

    await pullChanges(userId, lastSyncedAtTime);
    await pushChanges(userId, lastSyncedAtTime);

    const newSyncedAt = Date.now();
    await AsyncStorage.setItem(LAST_SYNCED_AT_KEY, newSyncedAt.toString());

    console.log(`Sync finished successfully at ${new Date(newSyncedAt)}`);
    return { success: true };
  } catch (error) {
    console.error('Sync failed:', error);
    return { success: false, error };
  }
}
