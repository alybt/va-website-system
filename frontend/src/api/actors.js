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

export const actorsApi = {
    getAll: () =>
        api.get('/actors').then(toArray),

    getById: (id) =>
        api.get(`/actors/${id}`).then(toItem),

    create: (payload) =>
        api.post('/actors', payload).then(toItem),

    update: (id, payload) =>
        api.put(`/actors/${id}`, payload).then(toItem),

    remove: (id) =>
        api.delete(`/actors/${id}`).then(toItem),
};