import { Calendar, Weight, VenetianMask, Activity, Hash } from 'lucide-react';
import { formatDate, formatWeight, calculateAge } from '../../../utils/formatters';
import { GENDER_LABELS } from '../../../utils/constants';

/**
 * Card informations rapides d'un animal
 *
 * @param {object} animal - données de l'animal
 */
const AnimalInfoCard = ({ animal }) => {
    const INFO_ROWS = [
        {
            label: 'Date de naissance',
            value: animal.birthDate
                ? `${formatDate(animal.birthDate)} (${calculateAge(animal.birthDate)})`
                : '—',
            icon: Calendar,
        },
        {
            label: 'Poids',
            value: formatWeight(animal.weight),
            icon: Weight,
        },
        {
            label: 'Genre',
            value: GENDER_LABELS[animal.gender],
            icon: VenetianMask,
        },
        {
            label: 'Stérilisé',
            value: animal.isNeutered ? 'Oui' : 'Non',
            icon: Activity,
        },
        {
            label: 'Numéro de puce',
            value: animal.chipNumber ?? 'Non renseigné',
            icon: Hash,
        },
    ];

    return (
        <div className="card p-5">
            <h2
                className="text-xs font-black uppercase tracking-widest mb-4"
                style={{ color: 'var(--color-text-muted)' }}
            >
                Informations
            </h2>

            <div className="flex flex-col gap-3">
                {INFO_ROWS.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--color-orange-50)' }}
                        >
                            <Icon size={14} style={{ color: 'var(--color-orange-400)' }} />
                        </div>
                        <div className="min-w-0">
                            <p
                                className="text-xs font-semibold"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {label}
                            </p>
                            <p
                                className="text-sm font-bold truncate"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                {value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimalInfoCard;