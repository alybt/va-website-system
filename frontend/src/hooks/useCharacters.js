import { useState, useEffect, useCallback } from 'react';
import { charactersApi } from '../api/characters.js';

export function useCharacters(mode = 'all', sourceId = null) {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);

    const fetchCharacters = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let data;
            if (mode === 'art' && sourceId)        data = await charactersApi.getByArt(sourceId);
            else if (mode === 'script' && sourceId) data = await charactersApi.getByScript(sourceId);
            else                                    data = await charactersApi.getAll();
            setCharacters(data);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to load characters');
        } finally {
            setLoading(false);
        }
    }, [mode, sourceId]);

    useEffect(() => { fetchCharacters(); }, [fetchCharacters]);

    const createCharacter = useCallback(async (payload) => {
        const newChar = await charactersApi.create(payload);
        setCharacters(prev => [...prev, newChar]);
        return newChar;
    }, []);

    const updateCharacter = useCallback(async (id, payload) => {
        const updated = await charactersApi.update(id, payload);
        setCharacters(prev => prev.map(c => c.character_id === id ? updated : c));
        return updated;
    }, []);

    const deleteCharacter = useCallback(async (id) => {
        await charactersApi.remove(id);
        setCharacters(prev => prev.filter(c => c.character_id !== id));
    }, []);

    return {
        characters, loading, error,
        refetch: fetchCharacters,
        createCharacter, updateCharacter, deleteCharacter,
    };
}