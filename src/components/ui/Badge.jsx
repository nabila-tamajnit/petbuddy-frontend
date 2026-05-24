import {
    SPECIES_LABELS,
    SPECIES_BADGE_CLASS,
    REMINDER_STATUS_LABELS,
    REMINDER_STATUS_COLOR,
    HEALTH_TYPE_LABELS,
} from '../../utils/constants';

/**
 * Composant Badge
 *
 * @param {string} variant   - species | status | type
 * @param {string} value     - valeur métier
 * @param {string} className - classes
 */
const Badge = ({ variant, value, className = '' }) => {

    // Label et style selon le variant
    const getConfig = () => {
        switch (variant) {

            case 'species':
                return {
                    label: SPECIES_LABELS[value] ?? value,
                    className: SPECIES_BADGE_CLASS[value] ?? 'badge',
                };

            case 'status':
                return {
                    label: REMINDER_STATUS_LABELS[value] ?? value,
                    style: {
                        backgroundColor: `${REMINDER_STATUS_COLOR[value]}20`,
                        color: REMINDER_STATUS_COLOR[value],
                    },
                    className: 'badge',
                };

            case 'type':
                return {
                    label: HEALTH_TYPE_LABELS[value] ?? value,
                    className: 'badge',
                    style: {
                        backgroundColor: 'var(--color-cream-100)',
                        color: 'var(--color-cream-500)',
                    },
                };

            default:
                return {
                    label: value,
                    className: 'badge',
                };
        }
    };

    const config = getConfig();

    return (
        <span
            className={`${config.className} ${className}`}
            style={config.style}
        >
            {config.label}
        </span>
    );
};

export default Badge;