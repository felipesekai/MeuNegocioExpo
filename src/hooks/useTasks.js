import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withRequest } from '../utils/asyncHandler';

const STORAGE_KEY = 'tasks_store';

const generateId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState(null);

  const persist = useCallback(async (nextTasks) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTasks));
  }, []);

  const refresh = useCallback(async () => {
    setError(null);
    await withRequest(
      async () => {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setTasks(JSON.parse(stored));
        } else {
          setTasks([]);
        }
      },
      { setLoading, onError: (err) => setError(err) },
    );
  }, []);

  const addTask = useCallback(
    async (title) => {
      setError(null);
      return withRequest(
        async () => {
          const next = [{ id: generateId(), title, done: false, createdAt: Date.now() }, ...tasks];
          setTasks(next);
          await persist(next);
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [tasks, persist],
  );

  const toggleTask = useCallback(
    async (id) => {
      setError(null);
      return withRequest(
        async () => {
          const next = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
          setTasks(next);
          await persist(next);
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [tasks, persist],
  );

  const deleteTask = useCallback(
    async (id) => {
      setError(null);
      return withRequest(
        async () => {
          const next = tasks.filter((t) => t.id !== id);
          setTasks(next);
          await persist(next);
        },
        { setLoading: setMutating, onError: (err) => setError(err) },
      );
    },
    [tasks, persist],
  );

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { tasks, loading, mutating, error, refresh, addTask, toggleTask, deleteTask, setTasks };
}
