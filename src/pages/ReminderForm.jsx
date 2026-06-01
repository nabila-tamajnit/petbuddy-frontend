import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import reminderService from '../services/reminder.service';
import animalService from '../services/animal.service';
import { REMINDER_TYPE_LABELS } from '../utils/constants';

const ReminderForm = () => {
    const navigate                = useNavigate();
    const { id, reminderId }      = useParams();
    const isEditMode              = !!reminderId;

    const [animal, setAnimal]         = useState(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors]         = useState({});

    const [form, setForm] = useState({
        type:        'vaccine',
        title:       '',
        description: '',
        dueDate:     '',
    });

    // ──────────────────── Chargement ────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                // On charge toujours l'animal pour afficher son nom
                const animalData = await animalService.getById(id);
                setAnimal(animalData);

                // En mode édition, on pré-remplit le formulaire
                if (isEditMode) {
                    const reminders = await reminderService.getByAnimal(id);
                    const reminder  = reminders.reminders.find(r => r._id === reminderId);
                    if (reminder) {
                        setForm({
                            type:        reminder.type,
                            title:       reminder.title,
                            description: reminder.description ?? '',
                            dueDate:     new Date(reminder.dueDate).toISOString().split('T')[0],
                        });
                    }
                }
            } catch (err) {
                console.error('Erreur chargement :', err);
                navigate(`/animals/${id}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, reminderId]);

    // ──────────────────── Mise à jour d'un champ ────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ──────────────────── Validation ────────────────────
    const validate = () => {
        const newErrors = {};
        if (!form.title.trim()) newErrors.title = 'Le titre est obligatoire';
        if (!form.dueDate)      newErrors.dueDate = 'La date est obligatoire';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ──────────────────── Soumission ────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            if (isEditMode) {
                await reminderService.update(id, reminderId, form);
            } else {
                await reminderService.create(id, form);
            }
            navigate(`/animals/${id}`);
        } catch (err) {
            console.error('Erreur soumission :', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title={isEditMode ? 'Modifier un rappel' : 'Nouveau rappel'}>
            <div className="max-w-xl mx-auto animate-fadeIn">

                {/* ──────────────────── En-tête ──────────────────── */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate(`/animals/${id}`)}
                        className="p-2 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                            backgroundColor: 'white',
                            border: '1.5px solid var(--color-border)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-orange-400)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    >
                        <ArrowLeft size={18} style={{ color: 'var(--color-text-muted)' }} />
                    </button>
                    <div>
                        <h1
                            className="text-2xl font-bold"
                            style={{
                                fontFamily: 'var(--font-syne)',
                                color: 'var(--color-text-primary)',
                            }}
                        >
                            {isEditMode ? 'Modifier le rappel' : 'Nouveau rappel'}
                        </h1>
                        {animal && (
                            <p
                                className="text-sm font-semibold"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Pour {animal.name}
                            </p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-5">

                        <div className="card p-5">
                            <div className="flex flex-col gap-4">

                                {/* Type */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="type">
                                        Type de rappel
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

                                {/* Titre */}
                                <Input
                                    label="Titre *"
                                    name="title"
                                    placeholder="Ex: Vaccin annuel, Vermifuge..."
                                    value={form.title}
                                    onChange={handleChange}
                                    error={errors.title}
                                />

                                {/* Date */}
                                <Input
                                    label="Date d'échéance *"
                                    name="dueDate"
                                    type="date"
                                    value={form.dueDate}
                                    onChange={handleChange}
                                    error={errors.dueDate}
                                />

                                {/* Description */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        placeholder="Informations supplémentaires... (optionnel)"
                                        rows={3}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ──────────────────── Boutons ──────────────────── */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate(`/animals/${id}`)}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isSubmitting}
                                leftIcon={<Save size={16} />}
                            >
                                {isEditMode ? 'Sauvegarder' : 'Créer le rappel'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default ReminderForm;