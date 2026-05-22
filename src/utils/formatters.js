// Formate une date en français
export const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

// Formate une date courte
export const formatDateShort = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR');
};

// Calcule l'âge à partir d'une date de naissance
export const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    const years = today.getFullYear() - birth.getFullYear();
    const months = today.getMonth() - birth.getMonth();

    if (years === 0) {
        const totalMonths = months < 0 ? 12 + months : months;
        return totalMonths <= 1 ? 'moins d\'1 mois' : `${totalMonths} mois`;
    }
    return years === 1 ? '1 an' : `${years} ans`;
};

// Formate le poids
export const formatWeight = (weight) => {
    if (!weight) return '—';
    return `${weight} kg`;
};

// Vérifie si une date de rappel est proche (7 prochains jours)
export const isUpcoming = (dueDate) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
};

// Vérifie si une date est dépassée
export const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
};