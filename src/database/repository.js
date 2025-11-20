import { database } from './index';
import { Q } from '@nozbe/watermelondb';

// ========== Client ==========

export const clientsCollection = database.get('clients');

export const observeClients = () => clientsCollection.query().observe();

export const getUpdatedClients = (since) => clientsCollection.query(Q.where('updated_at', Q.gt(since))).fetch();

export const createClient = async ({ name, phone }) => {
  await database.write(async () => {
    await clientsCollection.create(client => {
      client.name = name;
      client.phone = phone;
    });
  });
};

export const updateClient = async ({ clientId, name, phone }) => {
    const clientToUpdate = await clientsCollection.find(clientId);
    await database.write(async () => {
        await clientToUpdate.update(client => {
            client.name = name;
            client.phone = phone;
        });
    });
};

export const deleteClient = async (clientId) => {
    const clientToDelete = await clientsCollection.find(clientId);
    await database.write(async () => {
        await clientToDelete.markAsDeleted(); // Soft delete
        // await clientToDelete.destroyPermanently(); // Hard delete
    });
};

// ========== Product ==========

export const productsCollection = database.get('products');

export const observeProducts = () => productsCollection.query().observe();

export const getUpdatedProducts = (since) => productsCollection.query(Q.where('updated_at', Q.gt(since))).fetch();

export const createProduct = async ({ name, price }) => {
    await database.write(async () => {
        await productsCollection.create(product => {
            product.name = name;
            product.price = price;
        });
    });
};

export const updateProduct = async ({ productId, name, price }) => {
    const productToUpdate = await productsCollection.find(productId);
    await database.write(async () => {
        await productToUpdate.update(product => {
            product.name = name;
            product.price = price;
        });
    });
};

export const deleteProduct = async (productId) => {
    const productToDelete = await productsCollection.find(productId);
    await database.write(async () => {
        await productToDelete.markAsDeleted(); // Soft delete
    });
};

// ========== Order ==========

export const ordersCollection = database.get('orders');

export const observeOrders = () => ordersCollection.query().observe();

export const getUpdatedOrders = (since) => ordersCollection.query(Q.where('updated_at', Q.gt(since))).fetch();

export const createOrder = async ({ clientId, status, products }) => {
    let newOrder;
    await database.write(async () => {
        newOrder = await ordersCollection.create(order => {
            order.client.id = clientId;
            order.status = status;
        });

        for (const p of products) {
            await database.get('order_products').create(op => {
                op.order.id = newOrder.id;
                op.product.id = p.id;
                op.quantity = p.quantity;
            });
        }
    });
    return newOrder;
};

// ... (updateOrder, deleteOrder)
