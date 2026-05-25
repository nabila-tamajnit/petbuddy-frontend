import api from './api';

const userService = {

    /**
     * Récupérer le profil du user connecté
     * @returns {object} - profil complet sans password
     */
    getMe: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },

    /**
     * Supprimer le compte et toutes les données associées
     * @returns {object} - { message }
     */
    deleteAccount: async () => {
        const response = await api.delete('/users/me');
        return response.data;
    },
};

export default userService;