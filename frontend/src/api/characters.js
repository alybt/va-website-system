import api from './axios';

const toArray = (r) => {
    const payload = r?.data;
    if (Array.isArray(payload))       return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

const toItem = (r) => {
    const payload = r?.data;
        if (payload?.data && !Array.isArray(payload.data)) return payload.data;
    return payload ?? null;
};

export const charactersApi = {
    getAll: () =>
        api.get('/characters').then(toArray),

    getById: (id) =>
        api.get(`/characters/${id}`).then(toItem),

    getByArt: (artId) =>
        api.get(`/characters/by-art/${artId}`).then(toArray),

    getByScript: (scriptId) =>
        api.get(`/characters/by-script/${scriptId}`).then(toArray),

    create: (payload) =>
    api.post('/characters', payload).then(toItem),

    update: (id, payload) =>
        api.put(`/characters/${id}`, payload).then(toItem),

    remove: (id) =>
        api.delete(`/characters/${id}`).then(toItem),
};