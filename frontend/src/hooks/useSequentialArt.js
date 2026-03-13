import { useState, useEffect, useCallback } from 'react';
import { sequentialArtApi } from '../api/sequentialart.js';

export function useSequentialArt() {
    const [artList, setArtList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState(null);

    const fetchArt = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await sequentialArtApi.getAll();
            setArtList(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to load sequential art');
            setArtList([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchArt(); }, [fetchArt]);

    return { artList, loading, error, refetch: fetchArt };
}