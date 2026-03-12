import api from './axios';

export const charactersApi = {
    getAll: () =>
        api.get('/characters').then(r => r.data.data),

    getById: (id) =>
        api.get(`/characters/${id}`).then(r => r.data.data),

    getByArt: (artId) =>
        api.get(`/characters/by-art/${artId}`).then(r => r.data.data),

    getByScript: (scriptId) =>
        api.get(`/characters/by-script/${scriptId}`).then(r => r.data.data),

    create: (payload) =>
        api.post('/characters', payload).then(r => r.data.data),

    update: (id, payload) =>
        api.put(`/characters/${id}`, payload).then(r => r.data.data),

    remove: (id) =>
        api.delete(`/characters/${id}`).then(r => r.data.data),
};