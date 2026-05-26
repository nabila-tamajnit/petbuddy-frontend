import { useNavigate } from 'react-router-dom';
import { PawPrint, LogOut } from 'lucide-react';
import Avatar from '../ui/Avatar';
import useAuth from '../../hooks/useAuth';

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
            className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-7 h-16 border-b"
            style={{
                backgroundColor: 'white',
                borderColor: 'var(--color-border)',
            }}
        >
            {/* Logo */}
            <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2.5 cursor-pointer"
            >
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--gradient-orange)' }}
                >
                    <PawPrint size={18} color="white" />
                </div>
                <span
                    className="hidden md:block font-semibold text-base title-serif"
                    style={{
                        fontFamily: 'var(--font-syne)',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    PetBuddy
                </span>
            </button>

            {/* Titre mobile */}
            {title && (
                <span
                    className="lg:hidden font-bold text-sm absolute left-1/2 -translate-x-1/2"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    {title}
                </span>
            )}

            {/* Droite */}
            <div className="flex items-center gap-3">
                {user && (
                    <span
                        className="hidden md:block text-sm font-semibold"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {user.firstName}
                    </span>
                )}

                <button
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer"
                >
                    <Avatar src={user?.avatar} name={fullName} size="sm" />
                </button>

                {/* Bouton déconnexion */}
                <button
                    onClick={handleLogout}
                    className="hidden md:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                        color: 'var(--color-text-muted)',
                        border: '1.5px solid var(--color-border-md)',
                        backgroundColor: 'var(--color-bg)',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(224, 62, 62, 0.08)';
                        e.currentTarget.style.color = 'var(--color-error)';
                        e.currentTarget.style.borderColor = 'var(--color-error)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'var(--color-bg)';
                        e.currentTarget.style.color = 'var(--color-text-muted)';
                        e.currentTarget.style.borderColor = 'var(--color-border-md)';
                    }}
                >
                    <LogOut size={13} />
                    Déconnexion
                </button>
            </div>
        </header>
    );
};

export default Navbar;