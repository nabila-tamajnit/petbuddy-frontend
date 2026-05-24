/**
 * Composant EmptyState — état vide
 *
 * Affiché quand pas d'animaux, remplace la page blanche par un message clair + une action possible
 *
 * @param {node}   icon        - icône Lucide (contexte)
 * @param {string} title       - titre principal
 * @param {string} description - texte explicatif
 * @param {node}   action      - bouton ou lien d'action
 */
const EmptyState = ({
    icon,
    title,
    description,
    action = null,
}) => {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-6">

            {/* Icône */}
            {icon && (
                <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ backgroundColor: 'var(--color-green-50)' }}
                >
                    {/* Cloner l'icône pour lui imposer taille et couleur */}
                    <span style={{ color: 'var(--color-green-400)' }}>
                        {icon}
                    </span>
                </div>
            )}

            {/* Titre */}
            <h3
                className="title-serif text-xl mb-2"
                style={{ color: 'var(--color-cream-600)' }}
            >
                {title}
            </h3>

            {/* Description */}
            {description && (
                <p
                    className="text-sm max-w-xs mb-6"
                    style={{ color: 'var(--color-cream-400)' }}
                >
                    {description}
                </p>
            )}

            {/* Action */}
            {action}
        </div>
    );
};

export default EmptyState;