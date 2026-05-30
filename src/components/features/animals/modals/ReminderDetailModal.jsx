import { useState } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import { Bell, Edit, Trash2 } from 'lucide-react';
import { formatDate, isOverdue } from '../../../../utils/formatters';
import { REMINDER_TYPE_LABELS } from '../../../../utils/constants';
import reminderService from '../../../../services/reminder.service';

/**
 * Modal détail rappel — avec modifier et supprimer
 *
 * @param {object}   reminder   - rappel sélectionné
 * @param {string}   animalId   - id de l'animal parent
 * @param {function} onClose    - fermer le modal
 * @param {function} onMarkDone - marquer comme fait
 * @param {function} onUpdate   - callback après modification
 * @param {function} onDelete   - callback après suppression
 */
const ReminderDetailModal = ({
    reminder,
    animalId,
    onClose,
    onMarkDone,
    onUpdate,
    onDelete,
}) => {
    const [isEditing, setIsEditing]   = useState(false);
    const [isLoading, setIsLoading]   = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // ─────────────── State du formulaire ──────────────
    const [form, setForm] = useState({
        title:       reminder?.title       ?? '',
        description: reminder?.description ?? '',
        dueDate:     reminder?.dueDate
            ? new Date(reminder.dueDate).toISOString().split('T')[0]
            : '',
        type:        reminder?.type        ?? 'custom',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // ─────────────── Sauvegarder les modifications ───────────────
    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updated = await reminderService.update(animalId, reminder._id, form);
            onUpdate(updated);
            setIsEditing(false);
            onClose();
        } catch (err) {
            console.error('Erreur modification rappel :', err);
        } finally {
            setIsLoading(false);
        }
    };

    // ─────────────── Supprimer le rappel ───────────────
    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await reminderService.delete(animalId, reminder._id);
            onDelete(reminder._id);
            onClose();
        } catch (err) {
            console.error('Erreur suppression rappel :', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowConfirmDelete(false);
        onClose();
    };

    return (
        <Modal
            isOpen={!!reminder}
            onClose={handleClose}
            title={isEditing ? 'Modifier le rappel' : 'Détail du rappel'}
            size="sm"
        >
            {reminder && !isEditing && !showConfirmDelete && (
                <div className="flex flex-col gap-4">

                    {/* Contenu détail */}
                    <div>
                        <p
                            className="text-xs font-black uppercase tracking-widest mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {REMINDER_TYPE_LABELS[reminder.type]}
                        </p>
                        <p
                            className="text-lg font-bold"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            {reminder.title}
                        </p>
                    </div>

                    {reminder.description && (
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {reminder.description}
                        </p>
                    )}

                    <div
                        className="flex items-center gap-2 p-3 rounded-xl"
                        style={{
                            backgroundColor: isOverdue(reminder.dueDate)
                                ? 'rgba(224,62,62,0.08)'
                                : 'var(--color-orange-50)',
                        }}
                    >
                        <Bell
                            size={14}
                            style={{
                                color: isOverdue(reminder.dueDate)
                                    ? 'var(--color-error)'
                                    : 'var(--color-orange-500)',
                            }}
                        />
                        <p
                            className="text-sm font-bold"
                            style={{
                                color: isOverdue(reminder.dueDate)
                                    ? 'var(--color-error)'
                                    : 'var(--color-orange-600)',
                            }}
                        >
                            {formatDate(reminder.dueDate)}
                            {isOverdue(reminder.dueDate) && ' — En retard'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-wrap justify-end mt-2">
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
                                    title:       reminder.title,
                                    description: reminder.description ?? '',
                                    dueDate:     new Date(reminder.dueDate).toISOString().split('T')[0],
                                    type:        reminder.type,
                                });
                                setIsEditing(true);
                            }}
                        >
                            Modifier
                        </Button>
                        <Button
                            variant="teal"
                            onClick={() => onMarkDone(reminder._id)}
                        >
                            Fait
                        </Button>
                    </div>
                </div>
            )}

            {/* ─────────────── Mode édition ─────────────── */}
            {reminder && isEditing && (
                <div className="flex flex-col gap-4">
                    <Input
                        label="Titre"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Titre du rappel"
                    />

                    {/* Sélecteur type */}
                    <div className="flex flex-col">
                        <label
                            className="label-field"
                            htmlFor="type"
                        >
                            Type
                        </label>
                        <select
                            id="type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="input-field"
                        >
                            {Object.entries(REMINDER_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Date d'échéance"
                        name="dueDate"
                        type="date"
                        value={form.dueDate}
                        onChange={handleChange}
                    />

                    <Input
                        label="Description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Description optionnelle"
                    />

                    <div className="flex gap-3 justify-end mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            isLoading={isLoading}
                            onClick={handleSave}
                        >
                            Sauvegarder
                        </Button>
                    </div>
                </div>
            )}

            {/* ─────────────── Confirmation suppression ─────────────── */}
            {reminder && showConfirmDelete && (
                <div className="flex flex-col gap-4">
                    <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(224,62,62,0.06)' }}
                    >
                        <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-error)' }}>
                            Supprimer ce rappel ?
                        </p>
                        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            Cette action est irréversible.
                        </p>
                    </div>
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="ghost"
                            onClick={() => setShowConfirmDelete(false)}
                        >
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

export default ReminderDetailModal;