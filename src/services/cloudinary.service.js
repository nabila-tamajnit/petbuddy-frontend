/**
 * Service Cloudinary — upload d'images
 *
 * Utilise l'API upload non signé de Cloudinary
 * Aucun secret n'est exposé côté frontend
 */

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const cloudinaryService = {

    /**
     * Upload une image vers Cloudinary
     *
     * @param {File}   file     - fichier image sélectionné par l'user
     * @param {string} folder   - sous-dossier dans Cloudinary
     * @returns {string}        - URL publique de l'image uploadée
     */
    upload: async (file, folder = 'animals') => {
        // FormData est le format attendu par l'API Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        formData.append('folder', folder);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
                // Pas de Content-Type — le navigateur le définit automatiquement
                // avec le boundary correct pour FormData
            }
        );

        if (!response.ok) {
            throw new Error('Échec de l\'upload Cloudinary');
        }

        const data = await response.json();

        // secure_url = URL HTTPS publique de l'image
        return data.secure_url;
    },
};

export default cloudinaryService;