import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    PawPrint,
    Bell,
    User,
} from 'lucide-react';

/**
 *
 * @param {boolean} mobileBottom - active le mode bottom nav mobile
 */

// ──────────────── Liens de navigation ────────────────
// Définis UNE SEULE FOIS — utilisés dans les deux modes
const NAV_LINKS = [
    {
        to: '/dashboard',
        icon: LayoutDashboard,
        label: 'Tableau de bord',
        shortLabel: 'Accueil',
    },
    {
        to: '/animals',
        icon: PawPrint,
        label: 'Mes animaux',
        shortLabel: 'Animaux',
    },
    {
        to: '/reminders',
        icon: Bell,
        label: 'Rappels',
        shortLabel: 'Rappels',
    },
    {
        to: '/profile',
        icon: User,
        label: 'Profil',
        shortLabel: 'Profil',
    },
];

const Sidebar = ({ mobileBottom = false }) => {

    // ──────────────── Styles lien actif/inactif ────────────────
    const getLinkClass = (isActive) => {
        const base = 'flex items-center gap-3 rounded-xl transition-all duration-200 font-medium text-sm';

        if (isActive) {
            return `${base} ${mobileBottom
                ? 'flex-col gap-1' // mobile : même style mais avec un peu plus d'espace
                : 'px-4 py-3' // desktop : espace plus grand
            }`;
        }

        return `${base} ${mobileBottom ? 'flex-col gap-1' : 'px-4 py-3'}`;
    };

    const getStyle = (isActive) => ({
        color: isActive ? 'var(--color-green-600)' : 'var(--color-cream-400)',
        backgroundColor: isActive && !mobileBottom
            ? 'var(--color-green-50)'
            : 'transparent',
    });

    // ──────────────── Mode Bottom Nav (mobile) ───────────────────────────────────
    if (mobileBottom) {
        return (
            <nav
                className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 h-16 border-t"
                style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--color-cream-200)',
                }}
            >
                {NAV_LINKS.map(({ to, icon: Icon, shortLabel }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => getLinkClass(isActive)}
                        style={({ isActive }) => getStyle(isActive)}
                    >
                        <Icon size={20} />
                        <span className="text-xs">{shortLabel}</span>
                    </NavLink>
                ))}
            </nav>
        );
    }

    // ── Mode Sidebar (desktop) ────────────────
    return (
        <nav
            className="flex flex-col gap-1 p-4 w-56 h-full border-r"
            style={{
                backgroundColor: 'white',
                borderColor: 'var(--color-cream-200)',
            }}
        >
            {NAV_LINKS.map(({ to, icon: Icon, label }) => (
                <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) => getLinkClass(isActive)}
                    style={({ isActive }) => getStyle(isActive)}
                >
                    <Icon size={20} />
                    <span>{label}</span>
                </NavLink>
            ))}
        </nav>
    );
};

export default Sidebar;