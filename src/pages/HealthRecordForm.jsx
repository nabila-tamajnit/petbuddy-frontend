import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import healthRecordService from '../services/healthRecord.service';
import animalService from '../services/animal.service';
import { HEALTH_TYPE_LABELS } from '../utils/constants';

const HealthRecordForm = () => {
    const navigate              = useNavigate();
    const { id, recordId }      = useParams();
    const isEditMode            = !!recordId;

    const [animal, setAnimal]         = useState(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors]         = useState({});

    const [form, setForm] = useState({
        type:         'vet_visit',
        title:        '',
        date:         '',
        description:  '',
        value:        '',
        unit:         'kg',
        veterinarian: '',
        clinic:       '',
        nextDueDate:  '',
    });

    // ──────────────────── Chargement ────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const animalData = await animalService.getById(id);
                setAnimal(animalData);

                if (isEditMode) {
                    const record = await healthRecordService.getById(id, recordId);
                    setForm({
                        type:         record.type,
                        title:        record.title,
                        date:         new Date(record.date).toISOString().split('T')[0],
                        description:  record.description  ?? '',
                        value:        record.value        ?? '',
                        unit:         record.unit         ?? 'kg',
                        veterinarian: record.veterinarian ?? '',
                        clinic:       record.clinic       ?? '',
                        nextDueDate:  record.nextDueDate
                            ? new Date(record.nextDueDate).toISOString().split('T')[0]
                            : '',
                    });
                }
            } catch (err) {
                console.error('Erreur chargement :', err);
                navigate(`/animals/${id}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id, recordId]);

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
        if (!form.date)         newErrors.date  = 'La date est obligatoire';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ──────────────────── Soumission ────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // On nettoie les champs vides
            const payload = {
                type:         form.type,
                title:        form.title.trim(),
                date:         form.date,
                description:  form.description.trim()  || null,
                value:        form.value ? Number(form.value) : null,
                unit:         form.unit                || null,
                veterinarian: form.veterinarian.trim() || null,
                clinic:       form.clinic.trim()       || null,
                nextDueDate:  form.nextDueDate         || null,
            };

            if (isEditMode) {
                await healthRecordService.update(id, recordId, payload);
            } else {
                await healthRecordService.create(id, payload);
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
        <PageWrapper title={isEditMode ? 'Modifier un suivi' : 'Nouveau suivi'}>
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
                            {isEditMode ? 'Modifier le suivi' : 'Nouveau suivi santé'}
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

                        {/* ──────────────────── Infos principales ──────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Informations principales
                            </h2>

                            <div className="flex flex-col gap-4">

                                {/* Type */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="type">
                                        Type de suivi
                                    </label>
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

                                {/* Titre */}
                                <Input
                                    label="Titre *"
                                    name="title"
                                    placeholder="Ex: Visite annuelle, Vaccin rage..."
                                    value={form.title}
                                    onChange={handleChange}
                                    error={errors.title}
                                />

                                {/* Date */}
                                <Input
                                    label="Date *"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    error={errors.date}
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
                                        placeholder="Notes supplémentaires... (optionnel)"
                                        rows={3}
                                        className="input-field"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ──────────────────── Champs en + ──────────────────── */}

                        {/* Pesée */}
                        {form.type === 'weight' && (
                            <div className="card p-5">
                                <h2
                                    className="text-xs font-black uppercase tracking-widest mb-4"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Mesure
                                </h2>
                                <div className="flex gap-3">
                                    <Input
                                        label="Valeur"
                                        name="value"
                                        type="number"
                                        placeholder="Ex: 4.5"
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
                            </div>
                        )}

                        {/* Visite vétérinaire */}
                        {form.type === 'vet_visit' && (
                            <div className="card p-5">
                                <h2
                                    className="text-xs font-black uppercase tracking-widest mb-4"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Informations vétérinaire
                                </h2>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        label="Vétérinaire"
                                        name="veterinarian"
                                        placeholder="Dr. Martin"
                                        value={form.veterinarian}
                                        onChange={handleChange}
                                        hint="Optionnel"
                                    />
                                    <Input
                                        label="Clinique"
                                        name="clinic"
                                        placeholder="Clinique des animaux"
                                        value={form.clinic}
                                        onChange={handleChange}
                                        hint="Optionnel"
                                    />
                                    <Input
                                        label="Prochain rendez-vous"
                                        name="nextDueDate"
                                        type="date"
                                        value={form.nextDueDate}
                                        onChange={handleChange}
                                        hint="Optionnel"
                                    />
                                </div>
                            </div>
                        )}

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
                                {isEditMode ? 'Sauvegarder' : 'Créer le suivi'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default HealthRecordForm;