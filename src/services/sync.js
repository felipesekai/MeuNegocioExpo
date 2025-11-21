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

const LAST_SYNCED_AT_KEY = 'last_synced_at';

const toDate = (timestamp) => (timestamp ? new Date(timestamp) : new Date());

async function pullChanges(userId, lastSyncedAt) {
  console.log('Pulling changes...');
  const since = lastSyncedAt || 0;

  const remoteClients = (await firebase.getFBUpdatedClients(userId, since)) || {};
  const remoteProducts = (await firebase.getFBUpdatedProducts(userId, since)) || {};
  const remoteOrders = (await firebase.getFBUpdatedOrders(userId, since)) || {};

  for (const [clientId, remoteClient] of Object.entries(remoteClients)) {
    const localClient = await getClientById(clientId);

    if (remoteClient._status === 'deleted') {
      if (localClient) await deleteClient(clientId);
      continue;
    }

    const updatedAt = toDate(remoteClient.updated_at);
    const localUpdatedAt = localClient?.updatedAt?.getTime?.() || 0;

    if (!localClient || localUpdatedAt < updatedAt.getTime()) {
      await saveClient({
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
    const localProduct = await getProductById(productId);

    if (remoteProduct._status === 'deleted') {
      if (localProduct) await deleteProduct(productId);
      continue;
    }

    const updatedAt = toDate(remoteProduct.updated_at);
    const localUpdatedAt = localProduct?.updatedAt?.getTime?.() || 0;

    if (!localProduct || localUpdatedAt < updatedAt.getTime()) {
      await saveProduct({
        _id: productId,
        name: remoteProduct.name || '',
        description: remoteProduct.description || null,
        price: Number(remoteProduct.price) || 0,
        createdAt: remoteProduct.created_at ? toDate(remoteProduct.created_at) : updatedAt,
        updatedAt,
      });
    }
  }

  for (const [orderId, remoteOrder] of Object.entries(remoteOrders)) {
    const clientIdentifier = remoteOrder.clientId || remoteOrder.client_id;
    if (!clientIdentifier) continue;

    const localOrder = await getOrderById(orderId);

    if (remoteOrder._status === 'deleted') {
      if (localOrder) await deleteOrder(orderId);
      continue;
    }

    const updatedAt = toDate(remoteOrder.updated_at);
    const localUpdatedAt = localOrder?.updatedAt?.getTime?.() || 0;

    if (!localOrder || localUpdatedAt < updatedAt.getTime()) {
      await saveOrderRecord({
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
  updated_at: product.updatedAt ? product.updatedAt.getTime() : Date.now(),
  _status: 'updated',
});

const serializeOrder = (order) => ({
  id: order._id,
  client_id: order.clientId || '',
  status: order.status,
  updated_at: order.updatedAt ? order.updatedAt.getTime() : Date.now(),
  _status: 'updated',
});

async function pushChanges(userId, lastSyncedAt) {
  console.log('Pushing changes...');
  const sinceDate = new Date(lastSyncedAt || 0);

  const updatedClients = await getClientsUpdatedSince(sinceDate.getTime());
  for (const client of updatedClients) {
    await firebase.upsertClient(userId, serializeClient(client));
  }

  const updatedProducts = await getProductsUpdatedSince(sinceDate.getTime());
  for (const product of updatedProducts) {
    await firebase.upsertProduct(userId, serializeProduct(product));
  }

  const updatedOrders = await getOrdersUpdatedSince(sinceDate.getTime());
  for (const order of updatedOrders) {
    await firebase.upsertOrder(userId, serializeOrder(order));
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
