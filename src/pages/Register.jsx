import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, PawPrint } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuth from '../hooks/useAuth';
import authService from '../services/auth.service';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // ────────────────── State du formulaire ──────────────────
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // ────────────────── State des erreurs par champ ──────────────────
    const [errors, setErrors] = useState({});

    // ────────────────── State global ──────────────────
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // ────────────────── Mise à jour d'un champ ──────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));

        // Efface l'erreur du champ dès que l'utilisateur retape
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ────────────────── Validation ──────────────────
    const validate = () => {
        const newErrors = {};

        if (!form.firstName.trim()) {
            newErrors.firstName = 'Le prénom est obligatoire';
        }

        if (!form.lastName.trim()) {
            newErrors.lastName = 'Le nom est obligatoire';
        }

        if (!form.email.trim()) {
            newErrors.email = "L'email est obligatoire";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!form.password) {
            newErrors.password = 'Le mot de passe est obligatoire';
        } else if (form.password.length < 8) {
            newErrors.password = 'Minimum 8 caractères';
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = 'Confirmez votre mot de passe';
        } else if (form.password !== form.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ────────────────── Soumission ──────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) return;

        setIsLoading(true);

        try {
            // On n'envoie pas confirmPassword au backend
            const data = await authService.register({
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                email: form.email.trim(),
                password: form.password,
            });

            login(
                {
                    id: data.id,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                },
                data.token
            );

            navigate('/dashboard');

        } catch (err) {
            const message = err.response?.data?.message
                ?? 'Une erreur est survenue, réessayez';
            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >

            {/* Lien accueil */}
            <Link
                to="/"
                className="fixed top-4 left-4 flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                style={{
                    color: 'var(--color-text-muted)',
                    backgroundColor: 'white',
                    border: '1.5px solid var(--color-border)',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
            >
                <PawPrint size={14} style={{ color: 'var(--color-orange-400)' }} />
                PetBuddy
            </Link>

            <div className="w-full max-w-sm">

                {/* ────────────────── Logo ────────────────── */}
                <div className="flex flex-col items-center mb-8">
                    <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'var(--gradient-orange)' }}
                    >
                        <PawPrint size={28} color="white" />
                    </div>
                    <h1
                        className="title-serif text-2xl mb-1"
                        style={{ color: 'var(--color-cream-600)' }}
                    >
                        Créer un compte
                    </h1>
                    <p
                        className="text-sm"
                        style={{ color: 'var(--color-cream-400)' }}
                    >
                        Rejoignez PetBuddy pour suivre vos animaux
                    </p>
                </div>

                {/* ────────────────── Card formulaire ────────────────── */}
                <div className="card p-7">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="flex gap-3 mb-4">
                            <Input
                                label="Prénom"
                                name="firstName"
                                placeholder="Marie"
                                leftIcon={<User size={16} />}
                                value={form.firstName}
                                onChange={handleChange}
                                error={errors.firstName}
                                className="flex-1"
                            />
                            <Input
                                label="Nom"
                                name="lastName"
                                placeholder="Dupont"
                                value={form.lastName}
                                onChange={handleChange}
                                error={errors.lastName}
                                className="flex-1"
                            />
                        </div>

                        <Input
                            label="Adresse email"
                            name="email"
                            type="email"
                            placeholder="ton@email.com"
                            leftIcon={<Mail size={16} />}
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email}
                            className="mb-4"
                        />
                        <Input
                            label="Mot de passe"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock size={16} />}
                            value={form.password}
                            onChange={handleChange}
                            error={errors.password}
                            hint="Minimum 8 caractères"
                            className="mb-4"
                        />
                        <Input
                            label="Confirmer le mot de passe"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock size={16} />}
                            value={form.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            className="mb-6"
                        />

                        {apiError && (
                            <div
                                className="text-sm text-center mb-4 p-3 rounded-2xl font-semibold"
                                style={{
                                    color: 'var(--color-error)',
                                    backgroundColor: 'rgba(224, 62, 62, 0.08)',
                                }}
                            >
                                {apiError}
                            </div>
                        )}

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Créer mon compte
                        </Button>
                    </form>
                </div>

                <p
                    className="text-center text-sm font-semibold mt-5"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Déjà un compte ?{' '}
                    <Link
                        to="/login"
                        className="font-black"
                        style={{ color: 'var(--color-orange-500)' }}
                    >
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;