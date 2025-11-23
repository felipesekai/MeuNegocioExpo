import { useCallback, useEffect, useRef, useState } from 'react';
import { clientRepository } from '../database/repository';
import { withRequest } from '../utils/asyncHandler';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);
  const cacheReady = useRef(false);

  const refresh = useCallback(async (options = { force: false }) => {
    if (cacheReady.current && !options.force) return;
    setError(null);
    await withRequest(
      async () => {
        const all = await clientRepository.getAll();
        setClients(all);
        cacheReady.current = true;
      },
      {
        setLoading,
        onError: (err) => setError(err),
      },
    );
  }, []);

  const createClient = useCallback(
    async (clientData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await clientRepository.save(clientData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const updateClient = useCallback(
    async (clientData) => {
      setError(null);
      return withRequest(
        async () => {
          const saved = await clientRepository.save(clientData);
          cacheReady.current = false;
          await refresh({ force: true });
          return saved;
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [refresh],
  );

  const deleteClient = useCallback(
    async (clientId) => {
      setError(null);
      return withRequest(
        async () => {
          await clientRepository.remove(clientId);
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
    clients,
    loading,
    mutating,
    error,
    refresh,
    setClients,
    createClient,
    updateClient,
    deleteClient,
  };
}
