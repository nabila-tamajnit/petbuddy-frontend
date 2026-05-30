import { Cat, Dog, Bird, Rabbit, Squirrel, PawPrint } from 'lucide-react';

/**
 * Composant AnimalAvatar — avatar d'un animal avec icône par défaut selon l'espèce
 *
 * @param {string} src      - URL de la photo
 * @param {string} species  - cat | dog | bird | rabbit | hamster | other
 * @param {string} name     - nom de l'animal (pour alt)
 * @param {string} size     - sm | md | lg | xl
 * @param {function} onClick - callback au clic
 */

// ───────────────────── Icône Lucide par espèce ─────────────────────
const SPECIES_ICONS = {
    cat: Cat,
    dog: Dog,
    bird: Bird,
    rabbit: Rabbit,
    hamster: Squirrel,
    other: PawPrint,
};

// ───────────────────── Couleur de fond par espèce ─────────────────────
const SPECIES_COLORS = {
    cat: { bg: '#FFF0E0', icon: '#C45000' },
    dog: { bg: '#E0F7FA', icon: '#00695C' },
    bird: { bg: '#F0E8FF', icon: '#5020B0' },
    rabbit: { bg: '#E8F5E0', icon: '#2E7D32' },
    hamster: { bg: '#FFF8E0', icon: '#8C5A00' },
    other: { bg: '#F0F0F0', icon: '#555555' },
};

// ───────────────────── Tailles ─────────────────────
const SIZE_CONFIG = {
    sm: { container: 'w-8 h-8',    icon: 14 },
    md: { container: 'w-10 h-10',  icon: 18 },
    lg: { container: 'w-14 h-14',  icon: 26 },
    xl: { container: 'w-24 h-24',  icon: 44 },
};

const AnimalAvatar = ({
    src,
    species = 'other',
    name = '',
    size = 'md',
    onClick,
}) => {
    const sizeConfig = SIZE_CONFIG[size] ?? SIZE_CONFIG.md;
    const colors     = SPECIES_COLORS[species] ?? SPECIES_COLORS.other;
    const IconComponent = SPECIES_ICONS[species] ?? PawPrint;

    const baseClasses = [
        'rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center',
        sizeConfig.container,
        onClick ? 'cursor-pointer transition-opacity hover:opacity-80' : '',
    ].filter(Boolean).join(' ');

    // ───────────────────── Avec photo ─────────────────────
    if (src) {
        return (
            <img
                src={src}
                alt={name || 'Photo de l\'animal'}
                className={`${baseClasses} object-cover`}
                onClick={onClick}
            />
        );
    }

    // ───────────────────── Sans photo → icône ─────────────────────
    return (
        <div
            className={baseClasses}
            style={{ backgroundColor: colors.bg }}
            onClick={onClick}
        >
            <IconComponent
                size={sizeConfig.icon}
                style={{ color: colors.icon }}
            />
        </div>
    );
};

export default AnimalAvatar;