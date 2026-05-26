import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PawPrint, Bell, User, LogOut, Home, } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

/**
 * Sidebar — navigation principale des pages privées
 * @param {boolean} mobileBottom - active le mode bottom nav mobile
 */

const MAIN_LINKS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', shortLabel: 'Accueil' },
    { to: '/animals', icon: PawPrint, label: 'Mes animaux', shortLabel: 'Animaux' },
    { to: '/reminders', icon: Bell, label: 'Rappels', shortLabel: 'Rappels' },
];

const ACCOUNT_LINKS = [
    { to: '/profile', icon: User, label: 'Profil', shortLabel: 'Profil' },
];

const Sidebar = ({ mobileBottom = false }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // ──────────────── Styles lien actif/inactif ────────────────
    const getLinkClass = (isActive, isMobile) => {
        const base = 'flex items-center gap-3 text-sm font-bold transition-all duration-200 rounded-xl';
        if (isMobile) return `${base} flex-col gap-1 px-3 py-2`;
        return `${base} px-4 py-3 w-full`;
    };

    const getLinkStyle = (isActive) => ({
        color: isActive
            ? 'var(--color-orange-500)'
            : 'var(--color-text-muted)',
        backgroundColor: isActive
            ? 'var(--color-orange-50)'
            : 'transparent',
        borderLeft: isActive && !mobileBottom
            ? '3px solid var(--color-orange-400)'
            : '3px solid transparent',
        borderRadius: isActive ? '0 12px 12px 0' : '12px',
    });

    // ──────────────── Mode bottom nav mobile ────────────────
    if (mobileBottom) {
        return (
            <nav
                className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 h-16 border-t"
                style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--color-border)',
                }}
            >
                {[...MAIN_LINKS, ...ACCOUNT_LINKS].map(({ to, icon: Icon, label, shortLabel }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => getLinkClass(isActive, true)}
                        style={({ isActive }) => ({
                            color: isActive
                                ? 'var(--color-orange-500)'
                                : 'var(--color-text-muted)',
                        })}
                    >
                        <Icon size={20} />
                        <span className="text-xs">{shortLabel}</span>
                    </NavLink>
                ))}
            </nav>
        );
    }

    // ──────────────── Mode sidebar desktop ────────────────
    return (
        <nav
            className="flex flex-col h-full w-60 border-r py-6"
            style={{
                backgroundColor: 'white',
                borderColor: 'var(--color-border)',
            }}
        >
            {/* ──────────────── Section MENU ──────────────── */}
            <div className="px-5 mb-2">
                <p
                    className="text-xs font-black uppercase tracking-widest mb-3"
                    style={{ color: 'var(--color-text-light)' }}
                >
                    Menu
                </p>
                <div className="flex flex-col gap-1">
                    {MAIN_LINKS.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => getLinkClass(isActive, false)}
                            style={({ isActive }) => getLinkStyle(isActive)}
                            onMouseEnter={e => {
                                // Ne change pas si déjà actif
                                if (!e.currentTarget.style.color.includes('500')) {
                                    e.currentTarget.style.color = 'var(--color-orange-400)';
                                }
                            }}
                            onMouseLeave={e => {
                                // Remet la couleur normale si pas actif
                                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                                e.currentTarget.style.color = isActive
                                    ? 'var(--color-orange-500)'
                                    : 'var(--color-text-muted)';
                            }}
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </div>

            {/* ──────────────── Séparateur ──────────────── */}
            <div
                className="mx-5 my-4"
                style={{ borderTop: '1px solid var(--color-border)' }}
            />

            {/* ──────────────── Section COMPTE ──────────────── */}
            <div className="px-5">
                <p
                    className="text-xs font-black uppercase tracking-widest mb-3"
                    style={{ color: 'var(--color-text-light)' }}
                >
                    Compte
                </p>
                <div className="flex flex-col gap-1">
                    {ACCOUNT_LINKS.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => getLinkClass(isActive, false)}
                            style={({ isActive }) => getLinkStyle(isActive)}
                            onMouseEnter={e => {
                                // Ne change pas si déjà actif
                                if (!e.currentTarget.style.color.includes('500')) {
                                    e.currentTarget.style.color = 'var(--color-orange-400)';
                                }
                            }}
                            onMouseLeave={e => {
                                // Remet la couleur normale si pas actif
                                const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
                                e.currentTarget.style.color = isActive
                                    ? 'var(--color-orange-500)'
                                    : 'var(--color-text-muted)';
                            }}
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}

                    {/* Bouton logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer hover:opacity-80"
                        style={{
                            color: 'var(--color-text-muted)',
                            borderLeft: '3px solid transparent',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--color-error)';
                            e.currentTarget.style.backgroundColor = '#FFF0F0';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <LogOut size={18} />
                        Déconnexion
                    </button>
                </div>
            </div>

            {/* ──────────────── Lien page d'accueil en bas ──────────────── */}
            <div className="mt-auto px-5">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold rounded-xl transition-all duration-200"
                    style={{
                        color: 'var(--color-text-muted)',
                        borderLeft: '3px solid transparent',
                    }}
                    onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--color-orange-500)';
                            e.currentTarget.style.backgroundColor = 'var(--color-orange-50)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--color-text-muted)';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                >
                    <Home size={18} />
                    Page d'accueil
                </NavLink>
            </div>
        </nav>
    );
};

export default Sidebar;