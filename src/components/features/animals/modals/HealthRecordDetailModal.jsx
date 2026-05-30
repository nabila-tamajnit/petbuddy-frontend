import { useState } from 'react';
import Modal from '../../../ui/Modal';
import Button from '../../../ui/Button';
import Input from '../../../ui/Input';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '../../../../utils/formatters';
import { HEALTH_TYPE_LABELS } from '../../../../utils/constants';
import healthRecordService from '../../../../services/healthRecord.service';

const HealthRecordDetailModal = ({
    record,
    animalId,
    onClose,
    onUpdate,
    onDelete,
}) => {
    const [isEditing, setIsEditing]             = useState(false);
    const [isLoading, setIsLoading]             = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const [form, setForm] = useState({
        title:        record?.title        ?? '',
        description:  record?.description  ?? '',
        date:         record?.date
            ? new Date(record.date).toISOString().split('T')[0]
            : '',
        type:         record?.type         ?? 'note',
        value:        record?.value        ?? '',
        unit:         record?.unit         ?? '',
        veterinarian: record?.veterinarian ?? '',
        clinic:       record?.clinic       ?? '',
        nextDueDate:  record?.nextDueDate
            ? new Date(record.nextDueDate).toISOString().split('T')[0]
            : '',
    });

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const updated = await healthRecordService.update(animalId, record._id, form);
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
            await healthRecordService.delete(animalId, record._id);
            onDelete(record._id);
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

    return (
        <Modal
            isOpen={!!record}
            onClose={handleClose}
            title={isEditing ? 'Modifier le suivi' : 'Suivi santé'}
        >
            {record && !isEditing && !showConfirmDelete && (
                <div className="flex flex-col gap-4">
                    <div>
                        <p
                            className="text-xs font-black uppercase tracking-widest mb-1"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {HEALTH_TYPE_LABELS[record.type]} · {formatDate(record.date)}
                        </p>
                        <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            {record.title}
                        </p>
                    </div>

                    {record.description && (
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            {record.description}
                        </p>
                    )}

                    {record.value && (
                        <div className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                            <p className="text-sm font-bold" style={{ color: 'var(--color-teal-600)' }}>
                                {record.value} {record.unit}
                            </p>
                        </div>
                    )}

                    {record.veterinarian && (
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                            Vétérinaire : {record.veterinarian}
                            {record.clinic && ` — ${record.clinic}`}
                        </p>
                    )}

                    {record.nextDueDate && (
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                            Prochain rendez-vous : {formatDate(record.nextDueDate)}
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
                                    title:        record.title,
                                    description:  record.description ?? '',
                                    date:         new Date(record.date).toISOString().split('T')[0],
                                    type:         record.type,
                                    value:        record.value ?? '',
                                    unit:         record.unit ?? '',
                                    veterinarian: record.veterinarian ?? '',
                                    clinic:       record.clinic ?? '',
                                    nextDueDate:  record.nextDueDate
                                        ? new Date(record.nextDueDate).toISOString().split('T')[0]
                                        : '',
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
            {record && isEditing && (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="label-field" htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="input-field"
                        >
                            {Object.entries(HEALTH_TYPE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <Input label="Titre" name="title" value={form.title} onChange={handleChange} />
                    <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} />
                    <Input label="Description" name="description" value={form.description} onChange={handleChange} />

                    {/* Champs conditionnels selon le type */}
                    {form.type === 'weight' && (
                        <div className="flex gap-3">
                            <Input
                                label="Valeur"
                                name="value"
                                type="number"
                                value={form.value}
                                onChange={handleChange}
                                className="flex-1"
                            />
                            <div className="flex flex-col flex-1">
                                <label className="label-field" htmlFor="unit">Unité</label>
                                <select
                                    id="unit"
                                    name="unit"
                                    value={form.unit}
                                    onChange={handleChange}
                                    className="input-field"
                                >
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {form.type === 'vet_visit' && (
                        <>
                            <Input
                                label="Vétérinaire"
                                name="veterinarian"
                                value={form.veterinarian}
                                onChange={handleChange}
                            />
                            <Input
                                label="Clinique"
                                name="clinic"
                                value={form.clinic}
                                onChange={handleChange}
                            />
                            <Input
                                label="Prochain rendez-vous"
                                name="nextDueDate"
                                type="date"
                                value={form.nextDueDate}
                                onChange={handleChange}
                            />
                        </>
                    )}

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
            {record && showConfirmDelete && (
                <div className="flex flex-col gap-4">
                    <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(224,62,62,0.06)' }}
                    >
                        <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-error)' }}>
                            Supprimer ce suivi ?
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

export default HealthRecordDetailModal;