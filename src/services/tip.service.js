import api from './api';

const tipService = {

    /**
     * Récupérer tous les tips actifs
     * @returns {object} - { count, tips[] }
     */
    getAll: async () => {
        const response = await api.get('/tips');
        return response.data;
    },

    /**
     * Récupérer 3 tips aléatoires
     * @param {string} species - cat | dog | rabbit | bird | hamster | other | all
     * @returns {object}       - { count, tips[] }
     */
    getBySpecies: async (species) => {
        const response = await api.get(`/tips/species?species=${species}`);
        return response.data;
    },
};

export default tipService;