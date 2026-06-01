import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import wellnessService from '../services/wellness.service';
import animalService from '../services/animal.service';
import {
    MOOD_LABELS, APPETITE_LABELS,
    ACTIVITY_LABELS, SPECIES_ACTIVITIES,
} from '../utils/constants';

const WellnessForm = () => {
    const navigate          = useNavigate();
    const { id, logId }     = useParams();
    const isEditMode        = !!logId;

    const [animal, setAnimal]         = useState(null);
    const [isLoading, setIsLoading]   = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError]     = useState('');

    const [form, setForm] = useState({
        date:             new Date().toISOString().split('T')[0], // aujourd'hui par défaut
        mood:             'unknown',
        energyLevel:      '',
        activities:       [],
        activityDuration: '',
        appetite:         '',
        note:             '',
    });

    // ──────────────────── Chargement ────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                const animalData = await animalService.getById(id);
                setAnimal(animalData);

                if (isEditMode) {
                    const log = await wellnessService.getById(id, logId);
                    setForm({
                        date:             new Date(log.date).toISOString().split('T')[0],
                        mood:             log.mood             ?? 'unknown',
                        energyLevel:      log.energyLevel      ?? '',
                        activities:       log.activities       ?? [],
                        activityDuration: log.activityDuration ?? '',
                        appetite:         log.appetite         ?? '',
                        note:             log.note             ?? '',
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
    }, [id, logId]);

    // ──────────────────── Mise à jour d'un champ ────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ──────────────────── Toggle activité ────────────────────
    const toggleActivity = (activity) => {
        setForm(prev => ({
            ...prev,
            activities: prev.activities.includes(activity)
                ? prev.activities.filter(a => a !== activity)
                : [...prev.activities, activity],
        }));
    };

    // ──────────────────── Soumission ────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setIsSubmitting(true);

        try {
            const payload = {
                date:             form.date,
                mood:             form.mood,
                energyLevel:      form.energyLevel      ? Number(form.energyLevel) : null,
                activities:       form.activities,
                activityDuration: form.activityDuration ? Number(form.activityDuration) : null,
                appetite:         form.appetite         || null,
                note:             form.note.trim()      || null,
            };

            if (isEditMode) {
                await wellnessService.update(id, logId, payload);
            } else {
                await wellnessService.create(id, payload);
            }
            navigate(`/animals/${id}`);
        } catch (err) {
            // Le backend renvoie 409 si un log existe déjà ce jour
            if (err.response?.status === 409) {
                setApiError('Un log existe déjà pour cet animal aujourd\'hui.');
            } else {
                console.error('Erreur soumission :', err);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Spinner fullPage />;

    // Activités disponibles pour cette espèce
    const availableActivities = animal
        ? (SPECIES_ACTIVITIES[animal.species] ?? SPECIES_ACTIVITIES.other)
        : [];

    return (
        <PageWrapper title={isEditMode ? 'Modifier le log' : 'Log bien-être'}>
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
                            {isEditMode ? 'Modifier le log' : 'Log bien-être'}
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

                        {/* ──────────────────── Date + Humeur ──────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Comment va {animal?.name} ?
                            </h2>

                            <div className="flex flex-col gap-4">

                                {/* Date */}
                                <Input
                                    label="Date"
                                    name="date"
                                    type="date"
                                    value={form.date}
                                    onChange={handleChange}
                                />

                                {/* Humeur */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="mood">
                                        Humeur
                                    </label>
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

                                {/* Niveau d'énergie */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="energyLevel">
                                        Niveau d'énergie
                                    </label>
                                    <select
                                        id="energyLevel"
                                        name="energyLevel"
                                        value={form.energyLevel}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        <option value="">Non renseigné</option>
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <option key={n} value={n}>
                                                {n} — {['Très faible', 'Faible', 'Moyen', 'Bon', 'Excellent'][n - 1]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Appétit */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="appetite">
                                        Appétit
                                    </label>
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
                            </div>
                        </div>

                        {/* ──────────────────── Activités ──────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Activités du jour
                            </h2>

                            {/* Chips cliquables */}
                            <div className="flex flex-wrap gap-2 mb-4">
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

                            {/* Durée */}
                            <Input
                                label="Durée totale (minutes)"
                                name="activityDuration"
                                type="number"
                                placeholder="Ex: 30"
                                value={form.activityDuration}
                                onChange={handleChange}
                                hint="Optionnel"
                            />
                        </div>

                        {/* ──────────────────── Note libre ──────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Note libre
                            </h2>
                            <textarea
                                id="note"
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                placeholder="Observations, comportements particuliers... (optionnel)"
                                rows={4}
                                className="input-field w-full"
                            />
                        </div>

                        {/* Erreur API */}
                        {apiError && (
                            <div
                                className="p-4 rounded-2xl text-sm font-semibold text-center"
                                style={{
                                    color: 'var(--color-error)',
                                    backgroundColor: 'rgba(224, 62, 62, 0.08)',
                                }}
                            >
                                {apiError}
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
                                {isEditMode ? 'Sauvegarder' : 'Enregistrer le log'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default WellnessForm;