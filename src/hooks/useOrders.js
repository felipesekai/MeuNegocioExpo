import { useCallback, useEffect, useState } from 'react';
import { getAllOrders } from '../database';
import { withRequest } from '../utils/asyncHandler';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    await withRequest(
      async () => {
        const all = await getAllOrders();
        setOrders(all);
      },
      {
        setLoading,
        onError: (err) => setError(err),
      },
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { orders, loading, error, refresh, setOrders };
}
