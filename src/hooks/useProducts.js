import { useCallback, useEffect, useState } from 'react';
import { getAllProducts } from '../database';
import { withRequest } from '../utils/asyncHandler';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    await withRequest(
      async () => {
        const all = await getAllProducts();
        setProducts(all);
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

  return { products, loading, error, refresh, setProducts };
}
