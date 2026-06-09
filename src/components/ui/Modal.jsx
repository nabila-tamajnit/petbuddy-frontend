import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

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
    // Bloquer le scroll du body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Fermeture à la touche Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // createPortal téléporte le modal directement dans document.body
    // Ça évite tous les problèmes de stacking context
    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(44, 36, 32, 0.5)' }}
            onClick={onClose}
        >
            <div
                className={`
                    card w-full ${SIZE_CLASSES[size] ?? SIZE_CLASSES.md}
                    animate-fadeInScale
                    max-h-[90vh] overflow-y-auto
                `}
                onClick={e => e.stopPropagation()}
            >
                {/* En-tête */}
                <div
                    className="flex items-center justify-between p-5 border-b sticky top-0 bg-white rounded-t-2xl z-10"
                    style={{ borderColor: 'var(--color-border)' }}
                >
                    <h2 className="title-serif text-lg">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg transition-all duration-200 cursor-pointer hover:opacity-70"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>,
        document.body  // ← rendu directement dans le body
    );
};

export default Modal;