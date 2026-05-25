import api from './api';

const reminderService = {

    /**
     * Récupérer tous les rappels d'un animal
     * @param {string} animalId
     * @returns {object} - { count, reminders[] }
     */
    getByAnimal: async (animalId) => {
        const response = await api.get(`/animals/${animalId}/reminders`);
        return response.data;
    },

    /**
     * Récupérer tous les rappels en attente du user
     * @returns {object} - { count, reminders[] }
     */
    getPending: async () => {
        const response = await api.get('/reminders/pending');
        return response.data;
    },

    /**
     * Créer un rappel
     * @param {string} animalId
     * @param {object} data - { type, title, dueDate, description }
     * @returns {object}    - rappel créé
     */
    create: async (animalId, data) => {
        const response = await api.post(`/animals/${animalId}/reminders`, data);
        return response.data;
    },

    /**
     * Modifier un rappel
     * @param {string} animalId
     * @param {string} reminderId
     * @param {object} data
     * @returns {object} - rappel mis à jour
     */
    update: async (animalId, reminderId, data) => {
        const response = await api.put(`/animals/${animalId}/reminders/${reminderId}`, data);
        return response.data;
    },

    /**
     * Marquer un rappel comme fait
     * @param {string} animalId
     * @param {string} reminderId
     * @returns {object} - rappel mis à jour
     */
    markAsDone: async (animalId, reminderId) => {
        const response = await api.patch(`/animals/${animalId}/reminders/${reminderId}/done`);
        return response.data;
    },

    /**
     * Supprimer un rappel
     * @param {string} animalId
     * @param {string} reminderId
     * @returns {object} - { message }
     */
    delete: async (animalId, reminderId) => {
        const response = await api.delete(`/animals/${animalId}/reminders/${reminderId}`);
        return response.data;
    },
};

export default reminderService;