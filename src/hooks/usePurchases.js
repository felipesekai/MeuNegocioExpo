import { useState, useCallback } from 'react';
import { purchaseRepository } from '../database/repository';

export function usePurchases() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mutating, setMutating] = useState(false);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const data = await purchaseRepository.getAllBatches();
            setBatches(data);
            return data;
        } catch (error) {
            console.error('Error loading purchase batches:', error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createBatch = useCallback(async (products, purchasedAt = new Date()) => {
        setMutating(true);
        try {
            const batch = await purchaseRepository.createBatch({
                products,
                purchasedAt,
            });
            await refresh();
            return batch;
        } catch (error) {
            console.error('Error creating purchase batch:', error);
            throw error;
        } finally {
            setMutating(false);
        }
    }, [refresh]);

    const deleteBatch = useCallback(async (batchId) => {
        setMutating(true);
        try {
            await purchaseRepository.deleteBatch(batchId);
            await refresh();
        } catch (error) {
            console.error('Error deleting purchase batch:', error);
            throw error;
        } finally {
            setMutating(false);
        }
    }, [refresh]);

    const getItemsByBatch = useCallback(async (batchId) => {
        try {
            return await purchaseRepository.getItemsByBatch(batchId);
        } catch (error) {
            console.error('Error loading purchase items:', error);
            return [];
        }
    }, []);

    return {
        batches,
        loading,
        mutating,
        refresh,
        createBatch,
        deleteBatch,
        getItemsByBatch,
    };
}
