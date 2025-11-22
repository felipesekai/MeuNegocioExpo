import AsyncStorage from '@react-native-async-storage/async-storage';
import { synchronize } from '../../src/services/sync';
import * as firebase from '../../src/services/firebaseService';
import { clientRepository, productRepository, orderRepository } from '../../src/database/repository';

jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    setItem: jest.fn(async (key, value) => {
      store[key] = value;
    }),
    getItem: jest.fn(async (key) => store[key]),
    removeItem: jest.fn(async (key) => {
      delete store[key];
    }),
  };
});

jest.mock('../../src/services/firebaseService', () => ({
  getFBUpdatedClients: jest.fn().mockResolvedValue({}),
  getFBUpdatedProducts: jest.fn().mockResolvedValue({}),
  getFBUpdatedOrders: jest.fn().mockResolvedValue({}),
  upsertClient: jest.fn().mockResolvedValue(null),
  upsertProduct: jest.fn().mockResolvedValue(null),
  upsertOrder: jest.fn().mockResolvedValue(null),
}));

jest.mock('../../src/database', () => ({
  deleteClient: jest.fn(),
  deleteProduct: jest.fn(),
  deleteOrder: jest.fn(),
  saveClient: jest.fn(),
  saveProduct: jest.fn(),
  saveOrderRecord: jest.fn(),
  getClientById: jest.fn(),
  getProductById: jest.fn(),
  getOrderById: jest.fn(),
  getClientsUpdatedSince: jest.fn().mockResolvedValue([]),
  getProductsUpdatedSince: jest.fn().mockResolvedValue([]),
  getOrdersUpdatedSince: jest.fn().mockResolvedValue([]),
}));

jest.mock('../../src/database/repository', () => ({
  clientRepository: {
    getById: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
    updatedSince: jest.fn().mockResolvedValue([]),
  },
  productRepository: {
    getById: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
    updatedSince: jest.fn().mockResolvedValue([]),
  },
  orderRepository: {
    getById: jest.fn(),
    remove: jest.fn(),
    saveRecord: jest.fn(),
    updatedSince: jest.fn().mockResolvedValue([]),
    save: jest.fn(),
  },
}));

describe('synchronize service', () => {
  it('completes a sync cycle and stores last sync time', async () => {
    const result = await synchronize('user-1');

    expect(result.success).toBe(true);
    expect(firebase.upsertClient).toHaveBeenCalledTimes(0);
    expect(firebase.upsertProduct).toHaveBeenCalledTimes(0);
    expect(firebase.upsertOrder).toHaveBeenCalledTimes(0);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      'last_synced_at',
      expect.any(String),
    );
    expect(clientRepository.updatedSince).toHaveBeenCalledWith(expect.any(Number));
    expect(productRepository.updatedSince).toHaveBeenCalledWith(expect.any(Number));
    expect(orderRepository.updatedSince).toHaveBeenCalledWith(expect.any(Number));
  });
});
