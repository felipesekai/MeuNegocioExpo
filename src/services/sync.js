import { database } from '../database';
import { getUpdatedClients, getUpdatedProducts, getUpdatedOrders, clientsCollection, productsCollection, ordersCollection } from '../database/repository';
import * as firebase from './firebaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_SYNCED_AT_KEY = 'last_synced_at';

// Puxa as alterações do Firebase para o banco de dados local
async function pullChanges(userId, lastSyncedAt) {
    console.log('Pulling changes...');

    const remoteClients = await firebase.getFBUpdatedClients(userId, lastSyncedAt) || {};
    const remoteProducts = await firebase.getFBUpdatedProducts(userId, lastSyncedAt) || {};
    const remoteOrders = await firebase.getFBUpdatedOrders(userId, lastSyncedAt) || {};

    await database.write(async () => {
        // Clients
        for (const clientId in remoteClients) {
            const remoteClient = remoteClients[clientId];
            const localClient = await clientsCollection.find(clientId).catch(() => null);

            if (remoteClient._status === 'deleted') {
                if (localClient) await localClient.markAsDeleted();
                continue;
            }

            if (localClient) {
                if (localClient.updatedAt < remoteClient.updated_at) {
                    await localClient.update(record => {
                        record.name = remoteClient.name;
                        record.phone = remoteClient.phone;
                    });
                }
            } else {
                await clientsCollection.create(record => {
                    record._raw.id = clientId;
                    record.name = remoteClient.name;
                    record.phone = remoteClient.phone;
                });
            }
        }

        // Products
        for (const productId in remoteProducts) {
            const remoteProduct = remoteProducts[productId];
            const localProduct = await productsCollection.find(productId).catch(() => null);

            if (remoteProduct._status === 'deleted') {
                if (localProduct) await localProduct.markAsDeleted();
                continue;
            }

            if (localProduct) {
                if (localProduct.updatedAt < remoteProduct.updated_at) {
                    await localProduct.update(record => {
                        record.name = remoteProduct.name;
                        record.price = remoteProduct.price;
                    });
                }
            } else {
                await productsCollection.create(record => {
                    record._raw.id = productId;
                    record.name = remoteProduct.name;
                    record.price = remoteProduct.price;
                });
            }
        }
        
        // Orders (simplified)
        for (const orderId in remoteOrders) {
            const remoteOrder = remoteOrders[orderId];
            const localOrder = await ordersCollection.find(orderId).catch(() => null);

            if (remoteOrder._status === 'deleted') {
                if (localOrder) await localOrder.markAsDeleted();
                continue;
            }

            if (localOrder) {
                if (localOrder.updatedAt < remoteOrder.updated_at) {
                    await localOrder.update(record => {
                        record.status = remoteOrder.status;
                        record.client.id = remoteOrder.clientId;
                    });
                }
            } else {
                await ordersCollection.create(record => {
                    record._raw.id = orderId;
                    record.status = remoteOrder.status;
                    record.client.id = remoteOrder.clientId;
                });
            }
        }
    });
}

// Empurra as alterações locais para o Firebase
async function pushChanges(userId, lastSyncedAt) {
    console.log('Pushing changes...');

    // Clientes
    const updatedClients = await getUpdatedClients(lastSyncedAt);
    if (updatedClients.length > 0) {
        console.log(`Pushing ${updatedClients.length} client changes.`);
        for (const client of updatedClients) {
            const rawClient = client._raw;
            if (rawClient._status === 'deleted') {
                await firebase.deleteClient(userId, rawClient.id);
            } else {
                await firebase.upsertClient(userId, rawClient);
            }
        }
    }

    // Produtos
    const updatedProducts = await getUpdatedProducts(lastSyncedAt);
    if (updatedProducts.length > 0) {
        console.log(`Pushing ${updatedProducts.length} product changes.`);
        for (const product of updatedProducts) {
            const rawProduct = product._raw;
            if (rawProduct._status === 'deleted') {
                await firebase.deleteProduct(userId, rawProduct.id);
            } else {
                await firebase.upsertProduct(userId, rawProduct);
            }
        }
    }

    // Pedidos (simplificado, sem os itens do pedido por enquanto)
    const updatedOrders = await getUpdatedOrders(lastSyncedAt);
    if (updatedOrders.length > 0) {
        console.log(`Pushing ${updatedOrders.length} order changes.`);
        for (const order of updatedOrders) {
            const rawOrder = order._raw;
            if (rawOrder._status === 'deleted') {
                await firebase.deleteOrder(userId, rawOrder.id);
            } else {
                 // TODO: Sincronizar os itens do pedido (order_products)
                await firebase.upsertOrder(userId, rawOrder);
            }
        }
    }
}

export async function synchronize(userId) {
    try {
        const lastSyncedAt = await AsyncStorage.getItem(LAST_SYNCED_AT_KEY);
        // lastSyncedAtTime = 0 for first sync
        const lastSyncedAtTime = lastSyncedAt ? parseInt(lastSyncedAt, 10) + 1 : 0;

        console.log(`Starting sync for user ${userId}. Last sync: ${new Date(lastSyncedAtTime)}`);

        // PULL: Baixar primeiro para obter as alterações mais recentes
        await pullChanges(userId, lastSyncedAtTime);

        // PUSH: Enviar as alterações locais depois
        await pushChanges(userId, lastSyncedAtTime);

        // Marcar a nova data de sincronização
        const newSyncedAt = Date.now();
        await AsyncStorage.setItem(LAST_SYNCED_AT_KEY, newSyncedAt.toString());

        console.log(`Sync finished successfully at ${new Date(newSyncedAt)}`);
        return { success: true };

    } catch (error) {
        console.error('Sync failed:', error);
        return { success: false, error: error };
    }
}
