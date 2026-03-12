import api from './axios';

export const actorsApi = {
    getAll: () =>
        api.get('/actors').then(r => r.data.data),

    getById: (id) =>
        api.get(`/actors/${id}`).then(r => r.data.data),

    create: (payload) =>
        api.post('/actors', payload).then(r => r.data.data),

    update: (id, payload) =>
        api.put(`/actors/${id}`, payload).then(r => r.data.data),

    remove: (id) =>
        api.delete(`/actors/${id}`).then(r => r.data.data),
};