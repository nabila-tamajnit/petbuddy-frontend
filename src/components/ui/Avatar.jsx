/**
 * Composant Avatar
 * @param {string} src       - URL de l'image
 * @param {string} name      - nom complet
 * @param {string} size      - sm | md | lg
 * @param {string} className - classes en +
 */

// ─── Palette de couleurs pour les avatars sans image ─────────────
const AVATAR_COLORS = [
    { bg: 'var(--color-orange-100)', text: 'var(--color-orange-600)' },
    { bg: 'var(--color-teal-100)',   text: 'var(--color-teal-600)'   },
    { bg: '#F0F0F0',                 text: '#555555'                  },
    { bg: '#EDE9FF',                 text: '#5B21B6'                  },
    { bg: '#FFF8E0',                 text: '#8C5A00'                  },
    { bg: '#E0F7FA',                 text: '#00695C'                  },
];

// ────────────────────────── Tailles ──────────────────────────
const SIZE_CLASSES = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
};

// ─── Dérive une couleur stable depuis la première lettre du nom ───
// Même nom → toujours même couleur
const getColorFromName = (name = '') => {
    if (!name) return AVATAR_COLORS[0];

    // On prend la première lettre du nom en minuscule
    const firstLetter = name.trim()[0].toLowerCase();

    // On calcule sa position dans l'alphabet
    const position = firstLetter.charCodeAt(0) - 'a'.charCodeAt(0);

    // On reste dans les limites du tableau avec %
    return AVATAR_COLORS[position % AVATAR_COLORS.length];
};

// ─── Extrait les initiales depuis un nom complet ──────────────────
const getInitials = (name = '') => {
    const parts = name.trim().split(' ').filter(Boolean);

    if (parts.length >= 2) {
        // Première lettre du prénom + première lettre du nom
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    if (parts.length === 1 && parts[0].length >= 2) {
        // Deux premières lettres si un seul nom
        return parts[0].slice(0, 2).toUpperCase();
    }

    return '?';
};

// ────────────────────────── Composant ──────────────────────────
const Avatar = ({
    src,
    name = '',
    size = 'md',
    className = '',
}) => {
    const color = getColorFromName(name);
    const initials = getInitials(name);

    const baseClasses = [
        'rounded-full',
        'flex items-center justify-center',
        'font-semibold overflow-hidden flex-shrink-0',
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        className,
    ].filter(Boolean).join(' ');

    // ────────────────────────── Avec image ──────────────────────────
    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Avatar'}
                className={`${baseClasses} object-cover`}
            />
        );
    }

    // ────────────────────────── Sans image ──────────────────────────
    return (
        <div
            className={baseClasses}
            style={{
                backgroundColor: color.bg,
                color: color.text,
            }}
        >
            {initials}
        </div>
    );
};

export default Avatar;