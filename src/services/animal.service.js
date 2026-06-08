import api from './api';

const animalService = {

    // Récupérer tous les animaux actifs du user
    getAll: async () => {
        const response = await api.get('/animals');
        return response.data;
    },

    // Récupérer un animal par son id
    getById: async (id) => {
        const response = await api.get(`/animals/${id}`);
        return response.data;
    },

    // Créer un nouvel animal
    create: async (data) => {
        const response = await api.post('/animals', data);
        return response.data;
    },

    // Modifier un animal
    update: async (id, data) => {
        const response = await api.put(`/animals/${id}`, data);
        return response.data;
    },

    // Archiver un animal
    delete: async (id) => {
        const response = await api.delete(`/animals/${id}`);
        return response.data;
    },

    // Récupère les animaux archivés du user
    getArchived: async () => {
        const response = await api.get('/animals/archived');
        return response.data;
    },

    // Supprimer définitivement un animal et toutes ses données
    permanentDelete: async (id) => {
        const response = await api.delete(`/animals/${id}/permanent`);
        return response.data;
    },

    // Restaurer un animal archivé
    restore: async (id) => {
        const response = await api.patch(`/animals/${id}/restore`);
        return response.data;
    },
};

export default animalService;