import { renderHook, act } from '@testing-library/react-hooks';
import { useOrders } from '../../src/hooks/useOrders';
import { orderRepository, clientRepository, productRepository } from '../../src/database/repository';

jest.mock('../../src/database/repository', () => ({
  orderRepository: {
    getAll: jest.fn(),
    save: jest.fn(),
    saveRecord: jest.fn(),
    remove: jest.fn(),
    updateWithProducts: jest.fn(),
    getItems: jest.fn(),
    getById: jest.fn(),
    updateStatus: jest.fn(),
  },
  clientRepository: {
    getById: jest.fn(),
  },
  productRepository: {
    getAll: jest.fn(),
  },
}));

describe('useOrders hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('loads orders and filters cache', async () => {
    orderRepository.getAll.mockResolvedValueOnce([{ _id: '1', status: 'pending' }]);
    const { result, waitForNextUpdate } = renderHook(() => useOrders());
    await waitForNextUpdate();
    expect(result.current.orders).toHaveLength(1);
  });

  it('updates status and refreshes', async () => {
    orderRepository.getAll.mockResolvedValueOnce([{ _id: '1', status: 'pending' }]);
    orderRepository.getAll.mockResolvedValueOnce([{ _id: '1', status: 'paid' }]);
    const { result, waitForNextUpdate } = renderHook(() => useOrders());
    await waitForNextUpdate();
    await act(async () => {
      await result.current.updateStatus('1', 'paid');
    });
    expect(orderRepository.updateStatus).toHaveBeenCalledWith('1', 'paid');
    expect(result.current.orders[0].status).toBe('paid');
  });

  it('getOrderDetails returns merged data', async () => {
    orderRepository.getById.mockResolvedValue({ _id: '1', clientId: 'c1' });
    orderRepository.getItems.mockResolvedValue([{ productId: 'p1', quantity: 1 }]);
    clientRepository.getById.mockResolvedValue({ _id: 'c1', name: 'Client' });
    productRepository.getAll.mockResolvedValue([{ _id: 'p1', name: 'Prod', price: 10 }]);

    const { result } = renderHook(() => useOrders());
    const detail = await result.current.getOrderDetails('1');
    expect(detail.client.name).toBe('Client');
    expect(detail.items).toHaveLength(1);
  });
});
