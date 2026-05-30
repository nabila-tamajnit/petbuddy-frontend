import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';
import { MOOD_LABELS } from '../../../utils/constants';

/**
 * Card wellness + tip du jour
 *
 * @param {string}   animalId - id de l'animal
 * @param {array}    logs     - liste des wellness logs
 * @param {object}   tip      - tip du jour
 * @param {function} onSelect - callback quand on clique sur un log
 */
const AnimalWellnessCard = ({ animalId, logs, tip, onSelect }) => {
    const navigate = useNavigate();
    const lastLog  = logs[0] ?? null;

    return (
        <div className="flex flex-col gap-4">

            {/* ────────────── Dernier log wellness ────────────── */}
            <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Bien-être
                    </h2>
                    <button
                        onClick={() => navigate(`/animals/${animalId}/wellness/new`)}
                        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
                        style={{ backgroundColor: 'var(--color-teal-50)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-100)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-50)'}
                    >
                        <Plus size={14} style={{ color: 'var(--color-teal-500)' }} />
                    </button>
                </div>

                {lastLog ? (
                    <div
                        className="p-3 rounded-xl cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: 'var(--color-teal-50)' }}
                        onClick={() => onSelect(lastLog)}
                    >
                        <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {formatDate(lastLog.date)}
                        </p>
                        <p
                            className="text-sm font-bold mb-2"
                            style={{ color: 'var(--color-teal-600)' }}
                        >
                            {MOOD_LABELS[lastLog.mood]}
                        </p>
                        {lastLog.energyLevel && (
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(n => (
                                    <div
                                        key={n}
                                        className="h-1.5 flex-1 rounded-full"
                                        style={{
                                            backgroundColor: n <= lastLog.energyLevel
                                                ? 'var(--color-teal-400)'
                                                : 'var(--color-border)',
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p
                        className="text-sm font-semibold text-center py-4"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Aucun log enregistré
                    </p>
                )}
            </div>

            {/* ─────────────── Tip du jour ─────────────── */}
            {tip && (
                <div
                    className="card p-4 flex gap-3 items-start"
                    style={{
                        background: 'var(--gradient-teal)',
                        border: 'none',
                    }}
                >
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                        {tip.icon}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Sparkles size={11} color="white" />
                            <p
                                className="text-xs font-black uppercase tracking-widest"
                                style={{ color: 'rgba(255,255,255,0.75)' }}
                            >
                                Conseil du jour
                            </p>
                        </div>
                        <p className="text-xs font-semibold text-white leading-relaxed">
                            {tip.content}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnimalWellnessCard;