import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, PawPrint } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import useAuth from '../hooks/useAuth';
import authService from '../services/auth.service';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    // ────────────────── State du formulaire ──────────────────
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    // ────────────────── State des erreurs par champ ──────────────────
    const [errors, setErrors] = useState({});

    // ────────────────── State global ──────────────────
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // ────────────────── Mise à jour d'un champ ──────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Met à jour le champ modifié
        setForm(prev => ({ ...prev, [name]: value }));

        // Efface l'erreur du champ dès que l'utilisateur retape
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // ────────────────── Validation avant envoi ──────────────────
    const validate = () => {
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "L'email est obligatoire";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!form.password) {
            newErrors.password = 'Le mot de passe est obligatoire';
        }

        setErrors(newErrors);

        // Retourne true si aucune erreur
        return Object.keys(newErrors).length === 0;
    };

    // ────────────────── Soumission du formulaire ──────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Efface l'erreur API précédente
        setApiError('');

        // Validation locale — on s'arrête si invalide
        if (!validate()) return;

        setIsLoading(true);

        try {
            const data = await authService.login({
                email: form.email.trim(),
                password: form.password,
            });

            // Stocke le user et le token dans le context
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
            // L'intercepteur Axios met l'erreur
            const message = err.response?.data?.message
                ?? 'Une erreur est survenue, réessayez';
            setApiError(message);
        } finally {
            // finally s'exécute toujours (succès ou erreur)
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
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                        style={{ background: 'var(--gradient-orange)' }}
                    >
                        <PawPrint size={30} color="white" />
                    </div>
                    <h1
                        className="title-serif text-2xl mb-1"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        Bon retour !
                    </h1>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Connectez-vous pour retrouver vos animaux
                    </p>
                </div>

                {/* ────────────────── Card formulaire ────────────────── */}
                <div className="card p-7">
                    <form onSubmit={handleSubmit} noValidate>
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
                            Se connecter
                        </Button>
                    </form>
                </div>

                {/* ────────────────── Lien inscription ────────────────── */}
                <p
                    className="text-center text-sm font-semibold mt-5"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Pas encore de compte ?{' '}
                    <Link
                        to="/register"
                        className="font-black"
                        style={{ color: 'var(--color-orange-500)' }}
                    >
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;