/**
 * Composant Input — champ de formulaire réutilisable
 *
 * @param {string} label     - texte du label
 * @param {string} name      - id/name du champ
 * @param {string} error     - message d'erreur
 * @param {string} hint      - texte d'aide discret
 * @param {node}   leftIcon  - icône Lucide à gauche
 * @param {string} type      - type de l'input
 * @param {string} className - classes supplémentaires sur le wrapper
 */
const Input = ({
    label,
    name,
    error,
    hint,
    leftIcon = null,
    type = 'text',
    className = '',
    ...rest  // value, onChange, placeholder, disabled, required, etc.
}) => {
    return (
        <div className={`flex flex-col ${className}`}>

            {/* Label */}
            {label && (
                <label htmlFor={name} className="label-field">
                    {label}
                </label>
            )}

            {/* Conteneur position */}
            <div className="relative">

                {/* Icône gauche */}
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                         style={{ color: 'var(--color-cream-400)' }}>
                        {leftIcon}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    // Si icône → padding gauche augmenté pour ne pas chevaucher l'icône
                    className={`input-field ${leftIcon ? 'pl-10' : ''} ${error ? 'error' : ''}`}
                    {...rest}
                />
            </div>

            {/* Message d'erreur */}
            {error && (
                <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>
                    {error}
                </p>
            )}

            {/* Hint */}
            {!error && hint && (
                <p className="mt-1 text-xs" style={{ color: 'var(--color-cream-400)' }}>
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Input;