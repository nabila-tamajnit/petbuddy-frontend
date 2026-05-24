/**
 * Composant Card
 *
 * @param {boolean}  hoverable - ajoute l'effet hover
 * @param {string}   padding   - sm | md | lg — padding interne
 * @param {function} onClick   - si défini, rend la card cliquable
 * @param {string}   className - classes supplémentaires
 * @param {node}     children  - contenu de la card
 */

const PADDING_CLASSES = {
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
};

const Card = ({ hoverable = false, padding = 'md', onClick, className = '', children }) => {
    const classes = [
        'card',
        hoverable ? 'card-hover' : '',
        onClick ? 'cursor-pointer' : '',
        PADDING_CLASSES[padding] ?? PADDING_CLASSES.md,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;