import { renderHook, act } from '@testing-library/react-hooks';
import { useClients } from '../../src/hooks/useClients';
import { clientRepository } from '../../src/database/repository';

jest.mock('../../src/database/repository', () => ({
  clientRepository: {
    getAll: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
  productRepository: {},
  orderRepository: {},
}));

describe('useClients hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load clients on mount', async () => {
    clientRepository.getAll.mockResolvedValueOnce([{ _id: '1', name: 'Alice' }]);
    const { result, waitForNextUpdate } = renderHook(() => useClients());

    await waitForNextUpdate();

    expect(result.current.clients).toEqual([{ _id: '1', name: 'Alice' }]);
    expect(clientRepository.getAll).toHaveBeenCalledTimes(1);
  });

  it('should create client and refresh list', async () => {
    clientRepository.getAll.mockResolvedValueOnce([]);
    clientRepository.save.mockResolvedValue({ _id: '2', name: 'Bob' });
    clientRepository.getAll.mockResolvedValueOnce([{ _id: '2', name: 'Bob' }]);

    const { result, waitForNextUpdate } = renderHook(() => useClients());
    await waitForNextUpdate();

    await act(async () => {
      await result.current.createClient({ name: 'Bob' });
    });

    expect(clientRepository.save).toHaveBeenCalledWith({ name: 'Bob' });
    expect(result.current.clients).toEqual([{ _id: '2', name: 'Bob' }]);
  });
});
