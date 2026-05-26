import { useNavigate, Link } from 'react-router-dom';
import {
    PawPrint, Heart, Bell, Activity, ArrowRight, CheckCircle,
} from 'lucide-react';
import Button from '../components/ui/Button';
import useAuth from '../hooks/useAuth';

const FEATURES = [
    {
        icon: Heart,
        color: 'var(--color-orange-400)',
        bg: 'var(--color-orange-50)',
        title: 'Suivi bien-être',
        description: 'Notez l\'humeur, l\'énergie et les activités de votre animal au quotidien.',
    },
    {
        icon: Bell,
        color: 'var(--color-teal-400)',
        bg: 'var(--color-teal-50)',
        title: 'Rappels',
        description: 'Vaccins, vermifuges, toilettage — gardez une trace de chaque soin.',
    },
    {
        icon: Activity,
        color: 'var(--color-purple-400)',
        bg: 'var(--color-purple-50)',
        title: 'Carnet de santé',
        description: 'Centralisez les visites vétérinaires, médicaments et suivis de poids.',
    },
];

const Home = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >

            {/* ════════════════════════════════
                NAVBAR PUBLIQUE
            ════════════════════════════════ */}
            <header
                className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-10 h-16 border-b"
                style={{
                    backgroundColor: 'white',
                    borderColor: 'var(--color-border)',
                }}
            >
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: 'var(--gradient-orange)' }}
                    >
                        <PawPrint size={18} color="white" />
                    </div>
                    <span
                        className="hidden md:block font-semibold text-base title-serif"
                        style={{
                            fontFamily: 'var(--font-syne)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        PetBuddy
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        /* Connecté → accès direct au dashboard */
                        <Button onClick={() => navigate('/dashboard')}>
                            Mon espace
                        </Button>
                    ) : (
                        /* Non connecté → login + register */
                        <>
                            <Link
                                to="/login"
                                className="text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                                style={{ color: 'var(--color-text-secondary)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                            >
                                Se connecter
                            </Link>
                            <Button onClick={() => navigate('/register')}>
                                S'inscrire
                            </Button>
                        </>
                    )}
                </div>
            </header>

            {/* ════════════════════════════════
                HERO
            ════════════════════════════════ */}
            <section className="relative flex items-center min-h-[520px] md:min-h-[600px] overflow-hidden">

                {/* Image — desktop et mobile */}
                <picture className="absolute inset-0 w-full h-full">
                    {/* Mobile : image portrait */}
                    <source
                        media="(max-width: 767px)"
                        srcSet="/src/assets/images/hero-animals-mobile.png"
                    />
                    {/* Desktop : image paysage */}
                    <img
                        src="/src/assets/images/hero-animals.png"
                        alt="Un chien et un chat heureux"
                        className="w-full h-full object-cover object-right"
                    />
                </picture>

                {/* Overlay gradient */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: [
                            // Desktop : dégradé vers la droite
                            'linear-gradient(to right, rgba(250,250,248,0.97) 35%, rgba(250,250,248,0.6) 60%, transparent 80%)',
                        ].join(', '),
                    }}
                />

                {/* Sur mobile */}
                <div
                    className="absolute inset-0 md:hidden"
                    style={{
                        background: 'rgba(250,250,248,0.82)',
                    }}
                />

                {/* Contenu texte */}
                <div className="relative z-10 w-full px-5 md:px-10 lg:px-20 py-12">
                    <div className="max-w-lg">

                        {/* Chip */}
                        <div
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-5"
                            style={{
                                backgroundColor: 'var(--color-orange-100)',
                                color: 'var(--color-orange-600)',
                            }}
                        >
                            <PawPrint size={11} />
                            Application de suivi animalier
                        </div>

                        {/* Titre */}
                        <h1
                            className="text-3xl md:text-4xl font-bold mb-4 leading-snug"
                            style={{
                                fontFamily: 'var(--font-syne)',
                                color: 'var(--color-text-primary)',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Suivez le bien-être de vos{' '}
                            <span style={{ color: 'var(--color-orange-400)' }}>
                                animaux
                            </span>
                        </h1>

                        {/* Description */}
                        <p
                            className="text-base font-normal mb-7 leading-relaxed"
                            style={{ color: 'var(--color-text-secondary)' }}
                        >
                            PetBuddy centralise la santé, les rappels et
                            le bien-être quotidien de vos compagnons.
                        </p>

                        {/* CTAs */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {isAuthenticated ? (
                                <Button
                                    onClick={() => navigate('/dashboard')}
                                    rightIcon={<ArrowRight size={15} />}
                                >
                                    Accéder à mon espace
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => navigate('/register')}
                                        rightIcon={<ArrowRight size={15} />}
                                    >
                                        Créer un compte
                                    </Button>
                                    <Link
                                        to="/login"
                                        className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70 cursor-pointer"
                                        style={{ color: 'var(--color-text-secondary)' }}
                                    >
                                        Se connecter
                                        <ArrowRight size={13} />
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Mention */}
                        <div className="flex items-center gap-2 mt-5">
                            <CheckCircle size={13} style={{ color: 'var(--color-teal-400)' }} />
                            <span
                                className="text-xs font-semibold"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                Projet étudiant — accès libre
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                FEATURES
            ════════════════════════════════ */}
            <section className="px-5 md:px-10 lg:px-20 py-14 md:py-20">

                <div className="text-center mb-10">
                    <h2
                        className="text-2xl md:text-3xl font-bold mb-3"
                        style={{
                            fontFamily: 'var(--font-syne)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        Ce que vous pouvez faire
                    </h2>
                    <p
                        className="text-sm font-normal max-w-md mx-auto"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Toutes les fonctionnalités pour garder un oeil
                        sur la santé et le bonheur de vos animaux.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
                    {FEATURES.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="card p-6 card-hover">
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: feature.bg }}
                                >
                                    <Icon size={22} style={{ color: feature.color }} />
                                </div>
                                <h3
                                    className="text-base font-bold mb-2"
                                    style={{
                                        fontFamily: 'var(--font-syne)',
                                        color: 'var(--color-text-primary)',
                                    }}
                                >
                                    {feature.title}
                                </h3>
                                <p
                                    className="text-sm leading-relaxed"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ════════════════════════════════
                CTA FINAL
            ════════════════════════════════ */}
            <section className="px-5 md:px-10 lg:px-20 py-14">
                <div
                    className="max-w-2xl mx-auto rounded-3xl p-8 md:p-12 text-center"
                    style={{ background: 'var(--gradient-orange)' }}
                >
                    <h2
                        className="text-2xl md:text-3xl font-bold text-white mb-3"
                        style={{ fontFamily: 'var(--font-syne)' }}
                    >
                        Prêt à commencer ?
                    </h2>
                    <p
                        className="text-sm mb-7 max-w-sm mx-auto"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                    >
                        Créez votre compte et ajoutez votre premier animal en quelques minutes.
                    </p>
                    <button
                        onClick={() => navigate('/register')}
                        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer"
                        style={{
                            backgroundColor: 'white',
                            color: 'var(--color-orange-500)',
                        }}
                    >
                        Créer mon compte
                        <ArrowRight size={15} />
                    </button>
                </div>
            </section>

            {/* ════════════════════════════════
                FOOTER
            ════════════════════════════════ */}
            <footer
                className="border-t py-6 px-5 md:px-10 mt-auto"
                style={{ borderColor: 'var(--color-border)' }}
            >
                <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--gradient-orange)' }}
                        >
                            <PawPrint size={14} color="white" />
                        </div>
                        <span
                            className="font-bold text-sm"
                            style={{
                                fontFamily: 'var(--font-syne)',
                                color: 'var(--color-text-primary)',
                            }}
                        >
                            PetBuddy
                        </span>
                    </div>
                    <p
                        className="text-xs"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Projet étudiant · Interface3 Bruxelles · {new Date().getFullYear()}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;