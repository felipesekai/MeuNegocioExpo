import { useCallback, useEffect, useRef, useState } from 'react';
import { orderRepository, clientRepository, productRepository } from '../database/repository';
import { withRequest } from '../utils/asyncHandler';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const cacheReady = useRef(false);

  const refresh = useCallback(async (options = { force: false }) => {
    if (cacheReady.current && !options.force) return;
    setError(null);
    await withRequest(
      async () => {
        const all = await orderRepository.getAll();
        setOrders(all);
        cacheReady.current = true;
      },
      { setLoading, onError: (err) => setError(err) },
    );
  }, []);

  const createOrder = useCallback(
    async (orderData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await orderRepository.save(orderData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const updateOrderWithProducts = useCallback(
    async (orderData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await orderRepository.updateWithProducts(orderData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const upsertOrder = useCallback(
    async (orderData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await orderRepository.saveRecord(orderData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const deleteOrder = useCallback(
    async (orderId) => {
      setError(null);
      return withRequest(
        async () => {
          await orderRepository.remove(orderId);
          cacheReady.current = false;
          await refresh({ force: true });
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const updateStatus = useCallback(
    async (orderId, status) => {
      setError(null);
      return withRequest(
        async () => {
          await orderRepository.updateStatus(orderId, status);
          cacheReady.current = false;
          await refresh({ force: true });
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const getOrderDetails = useCallback(async (orderId) => {
    const order = await orderRepository.getById(orderId);
    if (!order) return null;
    const [items, client, productsSnapshot] = await Promise.all([
      orderRepository.getItems(orderId),
      order.clientId ? clientRepository.getById(order.clientId) : null,
      productRepository.getAll(),
    ]);
    return { ...order, client, items, productsSnapshot };
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    orders,
    loading,
    mutating,
    error,
    refresh,
    setOrders,
    createOrder,
    updateOrderWithProducts,
    upsertOrder,
    deleteOrder,
    getOrderDetails,
    updateStatus,
  };
}
