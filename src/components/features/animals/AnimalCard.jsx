import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Avatar from '../../ui/Avatar';
import Badge from '../../ui/Badge';
import { SPECIES_LABELS } from '../../../utils/constants';
import { calculateAge } from '../../../utils/formatters';

/**
 * Composant AnimalCard
 *
 * @param {object}   animal   - données de l'animal
 * @param {function} onClick  - callback au clic
 */
const AnimalCard = ({ animal, onClick }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (onClick) return onClick(animal);
        navigate(`/animals/${animal._id}`);
    };

    const age = calculateAge(animal.birthDate);

    return (
        <div
            className="card card-hover p-5 cursor-pointer flex flex-col gap-4"
            onClick={handleClick}
        >
            {/* ──────────────── En-tête — avatar + badge ──────────────── */}
            <div className="flex items-start justify-between">
                <Avatar
                    src={animal.photo}
                    name={animal.name}
                    size="lg"
                />
                <Badge variant="species" value={animal.species} />
            </div>

            {/* ──────────────── Infos principales ──────────────── */}
            <div className="flex-1">
                <h3
                    className="font-bold text-base mb-0.5"
                    style={{
                        fontFamily: 'var(--font-syne)',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    {animal.name}
                </h3>

                {/* Race ou espèce si pas de race */}
                <p
                    className="text-xs font-semibold mb-2"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    {animal.breed ?? SPECIES_LABELS[animal.species]}
                </p>

                {/* Age si disponible */}
                {age && (
                    <p
                        className="text-xs font-semibold"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {age}
                    </p>
                )}
            </div>

            {/* ──────────────── Pied de carte — lien voir détail ──────────────── */}
            <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: '1px solid var(--color-border)' }}
            >
                <span
                    className="text-xs font-bold"
                    style={{ color: 'var(--color-orange-500)' }}
                >
                    Voir le profil
                </span>
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-orange-50)' }}
                >
                    <ArrowUpRight size={14} style={{ color: 'var(--color-orange-400)' }} />
                </div>
            </div>
        </div>
    );
};

export default AnimalCard;