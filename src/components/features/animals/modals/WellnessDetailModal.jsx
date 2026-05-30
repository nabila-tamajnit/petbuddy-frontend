import { useState } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/formatters';
import { MOOD_LABELS, APPETITE_LABELS, ACTIVITY_LABELS, SPECIES_ACTIVITIES } from '../../../../utils/constants';
import wellnessService from '../../../../services/wellness.service';

const WellnessDetailModal = ({
    log,
    animalId,
    animalSpecies,
    onClose,
    onUpdate,
    onDelete,
}) => {
    const [isEditing, setIsEditing]             = useState(false);
    const [isLoading, setIsLoading]             = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [form, setForm] = useState({
        mood:             log?.mood             ?? 'unknown',
        energyLevel:      log?.energyLevel      ?? '',
        activities:       log?.activities       ?? [],
        activityDuration: log?.activityDuration ?? '',
        appetite:         log?.appetite         ?? '',
        note:             log?.note             ?? '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const toggleActivity = (activity) => {
        setForm(prev => ({
            ...prev,
            activities: prev.activities.includes(activity)
                ? prev.activities.filter(a => a !== activity)
                : [...prev.activities, activity],
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updated = await wellnessService.update(animalId, log._id, form);
            onUpdate(updated);
            setIsEditing(false);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await wellnessService.delete(animalId, log._id);
            onDelete(log._id);
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowConfirmDelete(false);
        onClose();
    };

    // Activités disponibles pour cette espèce
    const availableActivities = SPECIES_ACTIVITIES[animalSpecies] ?? SPECIES_ACTIVITIES.other;

    return (
        <Modal
            isOpen={!!log}
            onClose={handleClose}
            title={isEditing ? 'Modifier le log' : 'Log bien-être'}
            size="sm"
        >
            {log && !isEditing && !showConfirmDelete && (
                <div className="flex flex-col gap-4">
                    <p
                        className="text-xs font-black uppercase tracking-widest"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {formatDate(log.date)}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                Humeur
                            </p>
                            <p className="text-sm font-bold" style={{ color: 'var(--color-teal-600)' }}>
                                {MOOD_LABELS[log.mood]}
                            </p>
                        </div>

                        {log.energyLevel && (
                            <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-orange-50)' }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                    Énergie
                                </p>
                                <p className="text-sm font-bold" style={{ color: 'var(--color-orange-600)' }}>
                                    {log.energyLevel} / 5
                                </p>
                            </div>
                        )}
                    </div>

                    {log.appetite && (
                        <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                Appétit
                            </p>
                            <p className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {APPETITE_LABELS[log.appetite]}
                            </p>
                        </div>
                    )}

                    {log.activities?.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
                                Activités
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {log.activities.map(a => (
                                    <span key={a} className="chip chip-teal">
                                        {ACTIVITY_LABELS[a] ?? a}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {log.note && (
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {log.note}
                        </p>
                    )}

                    <div className="flex gap-2 justify-end flex-wrap mt-2">
                        <Button
                            variant="danger"
                            leftIcon={<Trash2 size={13} />}
                            onClick={() => setShowConfirmDelete(true)}
                        >
                            Supprimer
                        </Button>
                        <Button
                            variant="ghost"
                            leftIcon={<Edit size={13} />}
                            onClick={() => {
                                setForm({
                                    mood:             log.mood,
                                    energyLevel:      log.energyLevel ?? '',
                                    activities:       log.activities ?? [],
                                    activityDuration: log.activityDuration ?? '',
                                    appetite:         log.appetite ?? '',
                                    note:             log.note ?? '',
                                });
                                setIsEditing(true);
                            }}
                        >
                            Modifier
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Fermer
                        </Button>
                    </div>
                </div>
            )}

            {/* ─────────────── Mode édition ─────────────── */}
            {log && isEditing && (
                <div className="flex flex-col gap-4">

                    {/* Humeur */}
                    <div className="flex flex-col">
                        <label className="label-field" htmlFor="mood">Humeur</label>
                        <select
                            id="mood"
                            name="mood"
                            value={form.mood}
                            onChange={handleChange}
                            className="input-field"
                        >
                            {Object.entries(MOOD_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Énergie */}
                    <div className="flex flex-col">
                        <label className="label-field" htmlFor="energyLevel">
                            Niveau d'énergie (1-5)
                        </label>
                        <select
                            id="energyLevel"
                            name="energyLevel"
                            value={form.energyLevel}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">Non renseigné</option>
                            {[1,2,3,4,5].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>

                    {/* Appétit */}
                    <div className="flex flex-col">
                        <label className="label-field" htmlFor="appetite">Appétit</label>
                        <select
                            id="appetite"
                            name="appetite"
                            value={form.appetite}
                            onChange={handleChange}
                            className="input-field"
                        >
                            <option value="">Non renseigné</option>
                            {Object.entries(APPETITE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Activités */}
                    <div>
                        <p className="label-field mb-2">Activités</p>
                        <div className="flex flex-wrap gap-2">
                            {availableActivities.map(activity => (
                                <button
                                    key={activity}
                                    type="button"
                                    onClick={() => toggleActivity(activity)}
                                    className="chip cursor-pointer transition-all duration-200"
                                    style={{
                                        backgroundColor: form.activities.includes(activity)
                                            ? 'var(--color-teal-100)'
                                            : 'var(--color-bg)',
                                        color: form.activities.includes(activity)
                                            ? 'var(--color-teal-600)'
                                            : 'var(--color-text-muted)',
                                        border: form.activities.includes(activity)
                                            ? '1.5px solid var(--color-teal-200)'
                                            : '1.5px solid var(--color-border)',
                                    }}
                                >
                                    {ACTIVITY_LABELS[activity] ?? activity}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="flex flex-col">
                        <label className="label-field" htmlFor="note">Note</label>
                        <textarea
                            id="note"
                            name="note"
                            value={form.note}
                            onChange={handleChange}
                            placeholder="Note libre..."
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    <div className="flex gap-3 justify-end mt-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>
                            Annuler
                        </Button>
                        <Button isLoading={isLoading} onClick={handleSave}>
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            )}

            {/* ─────────────── Confirmation suppression ─────────────── */}
            {log && showConfirmDelete && (
                <div className="flex flex-col gap-4">
                    <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(224,62,62,0.06)' }}
                    >
                        <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-error)' }}>
                            Supprimer ce log ?
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Cette action est irréversible.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button variant="ghost" onClick={() => setShowConfirmDelete(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            isLoading={isLoading}
                            leftIcon={<Trash2 size={13} />}
                            onClick={handleDelete}
                        >
                            Supprimer
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default WellnessDetailModal;