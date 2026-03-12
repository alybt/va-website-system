import { useState, useEffect, useCallback } from 'react';
import { actorsApi } from '../api/actors';

export function useActors() {
    const [actors, setActors]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchActors = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await actorsApi.getAll();
            setActors(data);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to load actors');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchActors(); }, [fetchActors]);

    const createActor = useCallback(async (payload) => {
        const newActor = await actorsApi.create(payload);
        setActors(prev => [...prev, newActor]);
        return newActor;
    }, []);

    const updateActor = useCallback(async (id, payload) => {
        const updated = await actorsApi.update(id, payload);
        setActors(prev => prev.map(a => a.actor_id === id ? updated : a));
        return updated;
    }, []);

    const deleteActor = useCallback(async (id) => {
        await actorsApi.remove(id);
        setActors(prev => prev.filter(a => a.actor_id !== id));
    }, []);

    return { actors, loading, error, refetch: fetchActors, createActor, updateActor, deleteActor };
}