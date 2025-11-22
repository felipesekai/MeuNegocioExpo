import { useCallback, useEffect, useState } from 'react';
import { getAllClients } from '../database';
import { withRequest } from '../utils/asyncHandler';

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setError(null);
    await withRequest(
      async () => {
        const all = await getAllClients();
        setClients(all);
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

  return { clients, loading, error, refresh, setClients };
}
