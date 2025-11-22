import * as repo from './index';

export const clientRepository = {
  getAll: repo.getAllClients,
  getById: repo.getClientById,
  save: repo.saveClient,
  remove: repo.deleteClient,
  updatedSince: repo.getClientsUpdatedSince,
};

export const productRepository = {
  getAll: repo.getAllProducts,
  getById: repo.getProductById,
  save: repo.saveProduct,
  remove: repo.deleteProduct,
  updatedSince: repo.getProductsUpdatedSince,
};

export const orderRepository = {
  getAll: repo.getAllOrders,
  getById: repo.getOrderById,
  save: repo.createOrder,
  saveRecord: repo.saveOrderRecord,
  remove: repo.deleteOrder,
  updatedSince: repo.getOrdersUpdatedSince,
};
