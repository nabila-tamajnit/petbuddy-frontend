import { useNavigate } from 'react-router-dom';
import { Plus, Stethoscope, ArrowUpRight } from 'lucide-react';
import Button from '../../ui/Button';
import { formatDate } from '../../../utils/formatters';
import { HEALTH_TYPE_LABELS } from '../../../utils/constants';

/**
 * Card health records d'un animal
 *
 * @param {string}   animalId - id de l'animal
 * @param {array}    records  - liste des health records
 * @param {function} onSelect - callback quand on clique sur un record
 */
const AnimalHealthCard = ({ animalId, records, onSelect }) => {
    const navigate = useNavigate();

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
                <h2
                    className="text-xs font-black uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Suivi santé
                    {records.length > 0 && (
                        <span
                            className="ml-2 px-2 py-0.5 rounded-full text-xs"
                            style={{
                                backgroundColor: 'var(--color-teal-50)',
                                color: 'var(--color-teal-600)',
                            }}
                        >
                            {records.length}
                        </span>
                    )}
                </h2>
                <Button
                    variant="ghost"
                    leftIcon={<Plus size={14} />}
                    onClick={() => navigate(`/animals/${animalId}/health-records/new`)}
                >
                    Ajouter
                </Button>
            </div>

            {records.length === 0 ? (
                <p
                    className="text-sm font-semibold text-center py-6"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Aucun suivi enregistré
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {records.slice(0, 4).map(record => (
                        <div
                            key={record._id}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:opacity-80"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                            onClick={() => onSelect(record)}
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'var(--color-teal-50)' }}
                            >
                                <Stethoscope size={14} style={{ color: 'var(--color-teal-400)' }} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-bold truncate"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {record.title}
                                </p>
                                <p
                                    className="text-xs font-semibold"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {HEALTH_TYPE_LABELS[record.type]} · {formatDate(record.date)}
                                </p>
                            </div>
                            <ArrowUpRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </div>
                    ))}

                    {records.length > 4 && (
                        <button
                            onClick={() => navigate(`/animals/${animalId}/health-records`)}
                            className="text-xs font-bold text-center pt-2 cursor-pointer hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--color-teal-500)' }}
                        >
                            Voir tous les {records.length} records
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnimalHealthCard;