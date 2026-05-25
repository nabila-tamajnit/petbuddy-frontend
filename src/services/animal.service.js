import api from './api';

const animalService = {

    /**
     * Récupérer tous les animaux actifs du user
     * @returns {object} - { count, animals[] }
     */
    getAll: async () => {
        const response = await api.get('/animals');
        return response.data;
    },

    /**
     * Récupérer un animal par son id
     * @param {string} id
     * @returns {object} - animal complet
     */
    getById: async (id) => {
        const response = await api.get(`/animals/${id}`);
        return response.data;
    },

    /**
     * Créer un nouvel animal
     * @param {object} data - { name, species, breed, gender, ... }
     * @returns {object}    - animal créé
     */
    create: async (data) => {
        const response = await api.post('/animals', data);
        return response.data;
    },

    /**
     * Modifier un animal
     * @param {string} id
     * @param {object} data - champs à modifier
     * @returns {object}    - animal mis à jour
     */
    update: async (id, data) => {
        const response = await api.put(`/animals/${id}`, data);
        return response.data;
    },

    /**
     * Archiver un animal
     * @param {string} id
     * @returns {object} - { message }
     */
    delete: async (id) => {
        const response = await api.delete(`/animals/${id}`);
        return response.data;
    },

    /**
     * Supprimer définitivement un animal et toutes ses données
     * @param {string} id
     * @returns {object} - { message }
     */
    permanentDelete: async (id) => {
        const response = await api.delete(`/animals/${id}/permanent`);
        return response.data;
    },

    /**
     * Restaurer un animal archivé
     * @param {string} id
     * @returns {object} - { message, animal }
     */
    restore: async (id) => {
        const response = await api.patch(`/animals/${id}/restore`);
        return response.data;
    },
};

export default animalService;