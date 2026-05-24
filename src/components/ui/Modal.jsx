import { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Composant Modal — fenêtre de dialogue
 *
 * @param {boolean}  isOpen   - contrôle l'affichage
 * @param {function} onClose  - appelée à la fermeture
 * @param {string}   title    - titre affiché en en-tête
 * @param {node}     children - contenu de la modal
 * @param {string}   size     - sm | md | lg
 */

const SIZE_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
};

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md',
}) => {

    // ── Bloquer le scroll du body pendant l'ouverture ────────────
    // Pour pas scroller la page derrière la modal
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Restorer le scroll si le composant est démonté
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // ──────────────── Fermeture à la touche Escape ────────────────
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Retirer l'écouteur quand la modal se ferme
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Si fermée, on ne rend rien du tout
    if (!isOpen) return null;

    return (
        // ──────────────── Fond sombre (overlay) ────────────────
        // onClick sur l'overlay ferme la modal
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(44, 36, 32, 0.5)' }}
            onClick={onClose}
        >
            {/* ──────────────── Fenêtre de la modal ────────────────
                stopPropagation empêche le clic sur la fenêtre
                de remonter jusqu'à l'overlay et fermer la modal */}
            <div
                className={`
                    card w-full ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md}
                    animate-fadeIn
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* En-tête */}
                <div className="flex items-center justify-between p-5 border-b"
                     style={{ borderColor: 'var(--color-cream-200)' }}>
                    <h2 className="title-serif text-lg">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg transition-colors"
                        style={{ color: 'var(--color-cream-400)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;