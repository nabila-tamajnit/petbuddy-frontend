import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft, Camera, Save,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import AnimalAvatar from '../components/ui/AnimalAvatar';
import Spinner from '../components/ui/Spinner';
import animalService from '../services/animal.service';
import cloudinaryService from '../services/cloudinary.service';
import {
    SPECIES_LABELS, GENDER_LABELS,
} from '../utils/constants';

const AnimalForm = () => {
    const navigate    = useNavigate();
    const { id }      = useParams();
    const isEditMode  = !!id;
    const fileInputRef = useRef(null);

    // ─────────────────── States ───────────────────
    const [isLoading, setIsLoading]     = useState(isEditMode);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading]   = useState(false);
    const [errors, setErrors]             = useState({});

    const [form, setForm] = useState({
        name:        '',
        species:     'cat',
        breed:       '',
        gender:      'unknown',
        birthDate:   '',
        weight:      '',
        isNeutered:  false,
        chipNumber:  '',
        photo:       '',
    });

    // ─────────────────── Chargement en mode édition ───────────────────
    useEffect(() => {
        if (!isEditMode) return;

        const fetchAnimal = async () => {
            try {
                const animal = await animalService.getById(id);
                setForm({
                    name:       animal.name       ?? '',
                    species:    animal.species     ?? 'cat',
                    breed:      animal.breed       ?? '',
                    gender:     animal.gender      ?? 'unknown',
                    birthDate:  animal.birthDate
                        ? new Date(animal.birthDate).toISOString().split('T')[0]
                        : '',
                    weight:     animal.weight      ?? '',
                    isNeutered: animal.isNeutered  ?? false,
                    chipNumber: animal.chipNumber  ?? '',
                    photo:      animal.photo       ?? '',
                });
            } catch (err) {
                console.error('Erreur chargement animal :', err);
                navigate('/animals');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnimal();
    }, [id, isEditMode]);

    // ─────────────────── Mise à jour d'un champ ───────────────────
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Efface l'erreur du champ dès que l'utilisateur modifie
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ─────────────────── Upload photo ───────────────────
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setErrors(prev => ({ ...prev, photo: 'Veuillez choisir une image' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors(prev => ({ ...prev, photo: 'L\'image ne doit pas dépasser 5MB' }));
            return;
        }

        setIsUploading(true);
        try {
            const photoUrl = await cloudinaryService.upload(file, 'animals');
            setForm(prev => ({ ...prev, photo: photoUrl }));
        } catch (err) {
            setErrors(prev => ({ ...prev, photo: 'Erreur lors de l\'upload' }));
        } finally {
            setIsUploading(false);
        }
    };

    // ─────────────────── Validation ───────────────────
    const validate = () => {
        const newErrors = {};

        if (!form.name.trim()) {
            newErrors.name = 'Le nom est obligatoire';
        }
        if (!form.species) {
            newErrors.species = 'L\'espèce est obligatoire';
        }
        if (form.weight && isNaN(Number(form.weight))) {
            newErrors.weight = 'Le poids doit être un nombre';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ─────────────────── Soumission ───────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            // On nettoie les champs vides pour ne pas envoyer des strings vides
            const payload = {
                name:       form.name.trim(),
                species:    form.species,
                breed:      form.breed.trim()      || null,
                gender:     form.gender,
                birthDate:  form.birthDate         || null,
                weight:     form.weight
                    ? Number(form.weight)
                    : null,
                isNeutered: form.isNeutered,
                chipNumber: form.chipNumber.trim() || null,
                photo:      form.photo             || null,
            };

            if (isEditMode) {
                await animalService.update(id, payload);
                navigate(`/animals/${id}`);
            } else {
                const created = await animalService.create(payload);
                navigate(`/animals/${created._id}`);
            }
        } catch (err) {
            console.error('Erreur soumission :', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title={isEditMode ? 'Modifier' : 'Ajouter un animal'}>
            <div className="max-w-xl mx-auto animate-fadeIn">

                {/* ─────────────────── En-tête ─────────────────── */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate(isEditMode ? `/animals/${id}` : '/animals')}
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
                            {isEditMode ? 'Modifier l\'animal' : 'Ajouter un animal'}
                        </h1>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {isEditMode
                                ? 'Modifiez les informations ci-dessous'
                                : 'Remplissez les informations de votre animal'
                            }
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col gap-5">

                        {/* ─────────────────── Section photo ─────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Photo
                            </h2>

                            <div className="flex items-center gap-5">
                                {/* Prévisualisation */}
                                <div className="relative flex-shrink-0">
                                    <AnimalAvatar
                                        src={form.photo}
                                        species={form.species}
                                        name={form.name}
                                        size="xl"
                                    />
                                    {/* Badge caméra */}
                                    <div
                                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer"
                                        style={{ background: 'var(--gradient-orange)' }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera size={13} color="white" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 flex-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        leftIcon={<Camera size={15} />}
                                        isLoading={isUploading}
                                        onClick={() => fileInputRef.current?.click()}
                                        fullWidth
                                    >
                                        {form.photo ? 'Changer la photo' : 'Ajouter une photo'}
                                    </Button>
                                    <p
                                        className="text-xs text-center"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        JPG, PNG ou WEBP · Max 5MB · Optionnel
                                    </p>
                                    {errors.photo && (
                                        <p className="text-xs text-center" style={{ color: 'var(--color-error)' }}>
                                            {errors.photo}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Input file caché */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        {/* ─────────────────── Section infos principales ─────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Informations principales
                            </h2>

                            <div className="flex flex-col gap-4">

                                {/* Nom */}
                                <Input
                                    label="Nom *"
                                    name="name"
                                    placeholder="Ex: Milo"
                                    value={form.name}
                                    onChange={handleChange}
                                    error={errors.name}
                                />

                                {/* Espèce */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="species">
                                        Espèce *
                                    </label>
                                    <select
                                        id="species"
                                        name="species"
                                        value={form.species}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        {Object.entries(SPECIES_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.species && (
                                        <p className="mt-1 text-xs" style={{ color: 'var(--color-error)' }}>
                                            {errors.species}
                                        </p>
                                    )}
                                </div>

                                {/* Race */}
                                <Input
                                    label="Race"
                                    name="breed"
                                    placeholder="Ex: Persan, Labrador..."
                                    value={form.breed}
                                    onChange={handleChange}
                                    hint="Optionnel"
                                />

                                {/* Genre */}
                                <div className="flex flex-col">
                                    <label className="label-field" htmlFor="gender">
                                        Genre
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className="input-field"
                                    >
                                        {Object.entries(GENDER_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────── Section infos complémentaires ─────────────────── */}
                        <div className="card p-5">
                            <h2
                                className="text-xs font-black uppercase tracking-widest mb-4"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Informations complémentaires
                            </h2>

                            <div className="flex flex-col gap-4">

                                {/* Date de naissance */}
                                <Input
                                    label="Date de naissance"
                                    name="birthDate"
                                    type="date"
                                    value={form.birthDate}
                                    onChange={handleChange}
                                    hint="Optionnel"
                                />

                                {/* Poids */}
                                <Input
                                    label="Poids (kg)"
                                    name="weight"
                                    type="number"
                                    placeholder="Ex: 4.5"
                                    value={form.weight}
                                    onChange={handleChange}
                                    error={errors.weight}
                                    hint="Optionnel"
                                />

                                {/* Numéro de puce */}
                                <Input
                                    label="Numéro de puce"
                                    name="chipNumber"
                                    placeholder="15 chiffres"
                                    value={form.chipNumber}
                                    onChange={handleChange}
                                    hint="Optionnel"
                                />

                                {/* Stérilisé */}
                                <div className="flex items-center justify-between p-4 rounded-2xl"
                                     style={{ backgroundColor: 'var(--color-bg)' }}>
                                    <div>
                                        <p
                                            className="text-sm font-bold"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Stérilisé(e)
                                        </p>
                                        <p
                                            className="text-xs font-semibold"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            Cochez si votre animal est stérilisé
                                        </p>
                                    </div>

                                    {/* Toggle switch */}
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({
                                            ...prev,
                                            isNeutered: !prev.isNeutered,
                                        }))}
                                        className="relative flex-shrink-0 cursor-pointer transition-all duration-300"
                                        style={{
                                            width: '44px',
                                            height: '24px',
                                            borderRadius: '12px',
                                            backgroundColor: form.isNeutered
                                                ? 'var(--color-orange-400)'
                                                : 'var(--color-border-md)',
                                        }}
                                    >
                                        <div
                                            className="absolute top-0.5 transition-all duration-300"
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                left: form.isNeutered ? '22px' : '2px',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                            }}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─────────────────── Boutons soumission ─────────────────── */}
                        <div className="flex gap-3">
                            <Button
                                type="button"
                                variant="ghost"
                                fullWidth
                                onClick={() => navigate(isEditMode ? `/animals/${id}` : '/animals')}
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                fullWidth
                                isLoading={isSubmitting}
                                leftIcon={<Save size={16} />}
                            >
                                {isEditMode ? 'Sauvegarder' : 'Ajouter l\'animal'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </PageWrapper>
    );
};

export default AnimalForm;