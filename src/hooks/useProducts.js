import { useCallback, useEffect, useRef, useState } from 'react';
import { productRepository, purchaseRepository } from '../database/repository';
import { withRequest } from '../utils/asyncHandler';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const cacheReady = useRef(false);

  const refresh = useCallback(async (options = { force: false }) => {
    if (cacheReady.current && !options.force) return;
    setError(null);
    await withRequest(
      async () => {
        const [allProducts, allPurchases] = await Promise.all([
          productRepository.getAll(),
          purchaseRepository.getAllByProduct(),
        ]);

        const productsWithAvgCost = allProducts.map(product => {
          const productPurchases = allPurchases.filter(p => p.productId === product._id);
          const totalCost = productPurchases.reduce((acc, p) => acc + p.totalCost, 0);
          const totalQuantity = productPurchases.reduce((acc, p) => acc + p.quantity, 0);
          const averageCost = totalQuantity > 0 ? totalCost / totalQuantity : 0;
          return {
            ...product,
            averageCost,
          };
        });

        setProducts(productsWithAvgCost);
        cacheReady.current = true;
      },
      { setLoading, onError: (err) => setError(err) },
    );
  }, []);

  const createProduct = useCallback(
    async (productData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await productRepository.save(productData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const updateProduct = useCallback(
    async (productData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await productRepository.save(productData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const deleteProduct = useCallback(
    async (productId) => {
      setError(null);
      return withRequest(
        async () => {
          await productRepository.remove(productId);
          cacheReady.current = false;
          await refresh({ force: true });
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const addStock = useCallback(
    async (productId, amount) => {
      setError(null);
      return withRequest(
        async () => {
          await productRepository.addStock(productId, amount);
          cacheReady.current = false;
          await refresh({ force: true });
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const registerPurchase = useCallback(
    async (purchaseData) => {
      setError(null);
      return withRequest(
        async () => {
          await purchaseRepository.save(purchaseData);
          cacheReady.current = false;
          await refresh({ force: true });
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    products,
    loading,
    mutating,
    error,
    refresh,
    setProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    addStock,
    registerPurchase,
  };
}
