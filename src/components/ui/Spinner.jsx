import { Loader2 } from 'lucide-react';

/**
 * Composant Spinner (chargement)
 *
 * Utilisé pendant les appels API et les transitions de page
 *
 * @param {string}  size     - sm | md | lg
 * @param {string}  color    - green | white | muted
 * @param {boolean} fullPage - centre le spinner sur toute la hauteur de page
 */

const SIZE_PX = {
    sm: 16,
    md: 24,
    lg: 40,
};

const COLOR_STYLES = {
    green: 'var(--color-green-400)',
    white: 'white',
    muted: 'var(--color-cream-400)',
};

const Spinner = ({
    size = 'md',
    color = 'green',
    fullPage = false,
}) => {
    const icon = (
        <Loader2
            size={SIZE_PX[size] ?? SIZE_PX.md}
            className="animate-spin"
            style={{ color: COLOR_STYLES[color] ?? COLOR_STYLES.green }}
        />
    );

    // Mode pleine page — couvre tout l'écran et centre le spinner
    // Utilisé pendant le chargement initial de données
    if (fullPage) {
        return (
            <div className="min-h-screen flex items-center justify-center"
                 style={{ backgroundColor: 'var(--color-cream-50)' }}>
                {icon}
            </div>
        );
    }

    return icon;
};

export default Spinner;