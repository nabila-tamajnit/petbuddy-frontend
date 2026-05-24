import { useNavigate } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import Avatar from '../ui/Avatar';
import useAuth from '../../hooks/useAuth';

/**
 *
 * @param {string} title
 */
const Navbar = ({ title = '' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const fullName = user
        ? `${user.firstName} ${user.lastName ?? ''}`.trim()
        : '';

    return (
        <header
            className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 h-16 border-b"
            style={{
                backgroundColor: 'white',
                borderColor: 'var(--color-cream-200)',
            }}
        >
            {/* ──────────────── Gauche — Logo ──────────────── */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 cursor-pointer"
            >
                <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-green-400)' }}
                >
                    <PawPrint size={18} color="white" />
                </div>

                {/* Nom de l'app */}
                <span
                    className="hidden md:block font-semibold text-base title-serif"
                    style={{ color: 'var(--color-cream-600)' }}
                >
                    PetBuddy
                </span>
            </button>

            {/* ──────────────── Centre — Titre (mobile) ──────────────── */}
            {title && (
                <span
                    className="md:hidden font-semibold text-sm absolute left-1/2 -translate-x-1/2"
                    style={{ color: 'var(--color-cream-600)' }}
                >
                    {title}
                </span>
            )}

            {/* ──────────────── Droite — Avatar ──────────────── */}
            <div className="flex items-center gap-3">
                {/* Prénom — desktop */}
                {user && (
                    <span
                        className="hidden md:block text-sm"
                        style={{ color: 'var(--color-cream-500)' }}
                    >
                        Bonjour, {user.firstName}
                    </span>
                )}

                {/* Avatar cliquable → page profil */}
                <button onClick={() => navigate('/profile')} className="cursor-pointer">
                    <Avatar
                        src={user?.avatar}
                        name={fullName}
                        size="sm"
                    />
                </button>

                {/* Bouton logout — desktop */}
                <button
                    onClick={handleLogout}
                    className="hidden md:block text-xs px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                        color: 'var(--color-cream-400)',
                        border: '1px solid var(--color-cream-200)',
                    }}
                >
                    Déconnexion
                </button>
            </div>
        </header>
    );
};

export default Navbar;