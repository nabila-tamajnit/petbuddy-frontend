import api from './api';

const wellnessService = {

    /**
     * Récupérer tous les logs d'un animal
     * @param {string} animalId
     * @returns {object} - { count, logs[] }
     */
    getByAnimal: async (animalId) => {
        const response = await api.get(`/animals/${animalId}/wellness`);
        return response.data;
    },

    /**
     * Récupérer un log par son id
     * @param {string} animalId
     * @param {string} logId
     * @returns {object} - log complet
     */
    getById: async (animalId, logId) => {
        const response = await api.get(`/animals/${animalId}/wellness/${logId}`);
        return response.data;
    },

    /**
     * Créer un log de bien-être
     * @param {string} animalId
     * @param {object} data - { date, mood, energyLevel, activities, ... }
     * @returns {object}    - log créé
     */
    create: async (animalId, data) => {
        const response = await api.post(`/animals/${animalId}/wellness`, data);
        return response.data;
    },

    /**
     * Modifier un log existant
     * @param {string} animalId
     * @param {string} logId
     * @param {object} data
     * @returns {object} - log mis à jour
     */
    update: async (animalId, logId, data) => {
        const response = await api.put(`/animals/${animalId}/wellness/${logId}`, data);
        return response.data;
    },

    /**
     * Supprimer un log
     * @param {string} animalId
     * @param {string} logId
     * @returns {object} - { message }
     */
    delete: async (animalId, logId) => {
        const response = await api.delete(`/animals/${animalId}/wellness/${logId}`);
        return response.data;
    },
};

export default wellnessService;