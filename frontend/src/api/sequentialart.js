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

export const sequentialArtApi = { 
    getAll: () =>
        api.get('/sequential-art').then(toArray),

    getById: (id) =>
        api.get(`/sequential-art/${id}`).then(toItem),
};