import api from './api';

const authService = {

    /**
     * Inscription
     * @param {object} data - { firstName, lastName, email, password }
     * @returns {object}    - { id, firstName, lastName, email, token }
     */
    register: async (data) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    /**
     * Connexion
     * @param {object} data - { email, password }
     * @returns {object}    - { id, firstName, lastName, email, token }
     */
    login: async (data) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
};

export default authService;