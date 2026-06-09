import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles } from 'lucide-react';
import { formatDate } from '../../../utils/formatters';
import { MOOD_LABELS } from '../../../utils/constants';

const AnimalWellnessCard = ({ animalId, animalName, logs, tip, onSelect }) => {
    const navigate = useNavigate();

    const today    = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Vérifie si un log existe pour aujourd'hui
    const todayLog = logs.find(log => {
        const logDate = new Date(log.date).toISOString().split('T')[0];
        return logDate === todayStr;
    });

    // Dernier log en général (pour afficher si pas de log aujourd'hui)
    const lastLog = logs[0] ?? null;

    return (
        <div className="flex flex-col gap-4">

            {/* ────────────── Log bien-être ────────────── */}
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

                {/* Si log du jour → l'afficher */}
                {todayLog ? (
                    <div
                        className="p-3 rounded-xl cursor-pointer transition-all duration-200 hover:opacity-80"
                        style={{ backgroundColor: 'var(--color-teal-50)' }}
                        onClick={() => onSelect(todayLog)}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-semibold" style={{ color: 'var(--color-teal-600)' }}>
                                Aujourd'hui
                            </p>
                        </div>
                        <p className="text-sm font-bold mb-2" style={{ color: 'var(--color-teal-600)' }}>
                            {MOOD_LABELS[todayLog.mood]}
                        </p>
                        {todayLog.energyLevel && (
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(n => (
                                    <div
                                        key={n}
                                        className="h-1.5 flex-1 rounded-full"
                                        style={{
                                            backgroundColor: n <= todayLog.energyLevel
                                                ? 'var(--color-teal-400)'
                                                : 'var(--color-border)',
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    /* Pas de log aujourd'hui */
                    <div>
                        {/* Message d'invitation */}
                        <div
                            className="p-3 rounded-xl mb-3"
                            style={{ backgroundColor: 'var(--color-orange-50)' }}
                        >
                            <p className="text-xs font-bold" style={{ color: 'var(--color-orange-600)' }}>
                                Vous n'avez pas encore renseigné le bien-être de {animalName} aujourd'hui.
                            </p>
                            <button
                                onClick={() => navigate(`/animals/${animalId}/wellness/new`)}
                                className="text-xs font-black mt-1 cursor-pointer hover:opacity-70 transition-opacity"
                                style={{ color: 'var(--color-orange-500)' }}
                            >
                                Ajouter un log →
                            </button>
                        </div>

                        {/* Dernier log connu — discret */}
                        {lastLog && (
                            <div
                                className="p-3 rounded-xl cursor-pointer transition-all duration-200 hover:opacity-80"
                                style={{
                                    backgroundColor: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                }}
                                onClick={() => onSelect(lastLog)}
                            >
                                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    Dernier log — {formatDate(lastLog.date)}
                                </p>
                                <p className="text-sm font-bold" style={{ color: 'var(--color-text-secondary)' }}>
                                    {MOOD_LABELS[lastLog.mood]}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ────────────── Tip du jour ────────────── */}
            {tip && (
                <div
                    className="card p-4 flex gap-3 items-start"
                    style={{ background: 'var(--gradient-teal)', border: 'none' }}
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
                            <p className="text-xs font-black uppercase tracking-widest"
                               style={{ color: 'rgba(255,255,255,0.75)' }}>
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