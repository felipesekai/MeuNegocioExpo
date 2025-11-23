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
  addStock: repo.incrementProductStock,
  decrementStock: repo.decrementStock,
  updatedSince: repo.getProductsUpdatedSince,
};

export const purchaseRepository = {
  save: repo.createPurchase,
  saveRecord: repo.savePurchaseRecord,
  getAllByProduct: repo.getPurchases,
  updatedSince: repo.getPurchasesUpdatedSince,
};

export const orderRepository = {
  getAll: repo.getAllOrders,
  getById: repo.getOrderById,
  save: repo.createOrder,
  saveRecord: repo.saveOrderRecord,
  remove: repo.deleteOrder,
  updatedSince: repo.getOrdersUpdatedSince,
  updateWithProducts: repo.updateOrderWithProducts,
  getItems: repo.getOrderProductsByOrderId,
  updateStatus: repo.updateOrderStatus,
};
