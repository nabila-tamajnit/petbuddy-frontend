import { Loader2 } from 'lucide-react';

// ─────────────────── Map des variants ───────────────────
// Classes déjà dans index.css
const VARIANT_CLASSES = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
};

// ─────────────────── Map des tailles ───────────────────
// Taille de texte (le reste dans classes .btn-*)
const SIZE_CLASSES = {
    sm: 'py-1.5 px-4 text-xs',
    md: 'py-2 px-5 text-sm',
    lg: 'py-3 px-6 text-base',
};

/**
 * Composant Button
 *
 * @param {string}   variant    - primary | secondary | ghost | danger
 * @param {string}   size       - sm | md | lg
 * @param {boolean}  isLoading  - affiche un spinner et désactive le bouton
 * @param {node}     leftIcon   - icône Lucide à gauche
 * @param {node}     rightIcon  - icône Lucide à droite
 * @param {boolean}  fullWidth  - prend toute la largeur disponible
 * @param {string}   type       - type du bouton
 * @param {boolean}  disabled   - désactive le bouton
 * @param {node}     children   - contenu texte du bouton
 */
const Button = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon = null,
    rightIcon = null,
    fullWidth = false,
    type = 'button',
    disabled = false,
    children,
    className = '',
    ...rest  // capture onClick, aria-label, data-*, etc.
}) => {
    // Un bouton désactivé
    const isDisabled = disabled || isLoading;

    // ClassName finale
    const classes = [
        VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary,
        SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-50 cursor-not-allowed active:scale-100' : '',
        'inline-flex items-center justify-center gap-2',
        className,
    ]
        .filter(Boolean)  // supprimer les chaînes vides
        .join(' ');

    return (
        <button
            type={type}
            disabled={isDisabled}
            className={classes}
            {...rest}
        >
            {/* Spinner ou icône gauche */}
            {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
            ) : (
                leftIcon
            )}

            {/* Texte — masqué pendant le chargement */}
            {children && (
                <span className={isLoading ? 'opacity-0 absolute' : ''}>
                    {children}
                </span>
            )}

            {/* Icône droite — masquée pendant le chargement */}
            {!isLoading && rightIcon}
        </button>
    );
};

export default Button;