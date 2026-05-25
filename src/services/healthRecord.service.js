import api from './api';

const healthRecordService = {

    /**
     * Récupérer tous les records de santé d'un animal
     * @param {string} animalId
     * @returns {object} - { count, records[] }
     */
    getByAnimal: async (animalId) => {
        const response = await api.get(`/animals/${animalId}/health-records`);
        return response.data;
    },

    /**
     * Récupérer un record par son id
     * @param {string} animalId
     * @param {string} recordId
     * @returns {object} - record complet
     */
    getById: async (animalId, recordId) => {
        const response = await api.get(`/animals/${animalId}/health-records/${recordId}`);
        return response.data;
    },

    /**
     * Créer un record de santé
     * @param {string} animalId
     * @param {object} data - { type, date, title, description, ... }
     * @returns {object}    - record créé
     */
    create: async (animalId, data) => {
        const response = await api.post(`/animals/${animalId}/health-records`, data);
        return response.data;
    },

    /**
     * Modifier un record
     * @param {string} animalId
     * @param {string} recordId
     * @param {object} data
     * @returns {object} - record mis à jour
     */
    update: async (animalId, recordId, data) => {
        const response = await api.put(`/animals/${animalId}/health-records/${recordId}`, data);
        return response.data;
    },

    /**
     * Supprimer un record
     * @param {string} animalId
     * @param {string} recordId
     * @returns {object} - { message }
     */
    delete: async (animalId, recordId) => {
        const response = await api.delete(`/animals/${animalId}/health-records/${recordId}`);
        return response.data;
    },
};

export default healthRecordService;