import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, PawPrint, Bell, ArrowUpRight,
    ArrowRight, Sparkles, AlertCircle,
} from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Avatar from '../components/ui/Avatar';
import useAuth from '../hooks/useAuth';
import animalService from '../services/animal.service';
import reminderService from '../services/reminder.service';
import tipService from '../services/tip.service';
import { formatDate, isOverdue, isUpcoming } from '../utils/formatters';
import { SPECIES_LABELS } from '../utils/constants';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [animals, setAnimals] = useState([]);
    const [reminders, setReminders] = useState([]);
    const [tip, setTip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalsData, remindersData] = await Promise.all([
                    animalService.getAll(),
                    reminderService.getPending(),
                ]);

                setAnimals(animalsData.animals);
                setReminders(remindersData.reminders);

                if (animalsData.animals.length > 0) {
                    const firstSpecies = animalsData.animals[0].species;
                    const tipData = await tipService.getBySpecies(firstSpecies);
                    if (tipData.tips.length > 0) setTip(tipData.tips[0]);
                }
            } catch (err) {
                console.error('Erreur chargement dashboard :', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const urgentReminders = reminders
        .filter(r => isOverdue(r.dueDate) || isUpcoming(r.dueDate))
        .slice(0, 4);

    const overdueCount = reminders.filter(r => isOverdue(r.dueDate)).length;
    const upcomingCount = reminders.filter(r => isUpcoming(r.dueDate)).length;

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title="Accueil">
            <div className="max-w-5xl mx-auto animate-fadeIn">

                {/* ── En-tête page style Donezo ─────────────────── */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1 className="title-serif text-2xl md:text-3xl mb-1 flex items-center gap-2">
                            Bonjour, {user?.firstName}
                            <Sparkles size={20} style={{ color: 'var(--color-orange-400)' }} />
                        </h1>
                        <p
                            className="text-sm"
                            style={{ color: 'var(--color-cream-400)' }}
                        >
                            {animals.length === 0
                                ? 'Commencez par ajouter votre premier animal'
                                : `Vous suivez ${animals.length} animal${animals.length > 1 ? 's' : ''}`
                            }
                        </p>
                    </div>
                    {animals.length > 0 && (
                        <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => navigate('/animals/new')}
                        >
                            Ajouter un animal
                        </Button>
                    )}
                </div>

                {animals.length === 0 ? (
                    <EmptyState
                        icon={<PawPrint size={28} />}
                        title="Aucun animal pour le moment"
                        description="Ajoutez votre premier compagnon pour commencer à suivre son bien-être."
                        action={
                            <Button
                                leftIcon={<Plus size={16} />}
                                onClick={() => navigate('/animals/new')}
                            >
                                Ajouter un animal
                            </Button>
                        }
                    />
                ) : (
                    <div className="flex flex-col gap-6">

                        {/* ── Ligne 1 ── */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* Card hero */}
                            <div
                                className="col-span-2 lg:col-span-1 rounded-2xl p-5 flex flex-col justify-between min-h-[140px] cursor-pointer"
                                style={{ background: 'var(--gradient-orange)' }}
                                onClick={() => navigate('/animals')}
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-bold text-white opacity-90">
                                        Mes animaux
                                    </p>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
                                    >
                                        <ArrowUpRight size={16} color="white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-5xl font-black text-white leading-none mb-1">
                                        {animals.length}
                                    </p>
                                    <p className="text-xs text-white opacity-75 font-semibold">
                                        {animals.length > 1 ? 'animaux suivis' : 'animal suivi'}
                                    </p>
                                </div>
                            </div>

                            {/* Card rappels en attente */}
                            <div
                                className="card p-5 flex flex-col justify-between min-h-[140px] cursor-pointer card-hover"
                                onClick={() => navigate('/reminders')}
                            >
                                <div className="flex items-start justify-between">
                                    <p
                                        className="text-sm font-bold"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        Rappels
                                    </p>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--color-border)' }}
                                    >
                                        <ArrowUpRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                                    </div>
                                </div>
                                <div>
                                    <p
                                        className="text-5xl font-black leading-none mb-1"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        {reminders.length}
                                    </p>
                                    <p
                                        className="text-xs font-semibold"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        en attente
                                    </p>
                                </div>
                            </div>

                            {/* Card urgents */}
                            <div
                                className="card p-5 flex flex-col justify-between min-h-[140px] cursor-pointer card-hover"
                                onClick={() => navigate('/reminders')}
                            >
                                <div className="flex items-start justify-between">
                                    <p
                                        className="text-sm font-bold"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        Urgents
                                    </p>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: overdueCount > 0
                                                ? 'rgba(224, 62, 62, 0.1)'
                                                : 'var(--color-border)',
                                        }}
                                    >
                                        <ArrowUpRight
                                            size={16}
                                            style={{
                                                color: overdueCount > 0
                                                    ? 'var(--color-error)'
                                                    : 'var(--color-text-muted)',
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p
                                        className="text-5xl font-black leading-none mb-1"
                                        style={{
                                            color: overdueCount > 0
                                                ? 'var(--color-error)'
                                                : 'var(--color-text-primary)',
                                        }}
                                    >
                                        {overdueCount}
                                    </p>
                                    <p
                                        className="text-xs font-semibold"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        en retard
                                    </p>
                                </div>
                            </div>

                            {/* Card à venir */}
                            <div
                                className="card p-5 flex flex-col justify-between min-h-[140px] cursor-pointer card-hover"
                                onClick={() => navigate('/reminders')}
                            >
                                <div className="flex items-start justify-between">
                                    <p
                                        className="text-sm font-bold"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        Cette semaine
                                    </p>
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{ backgroundColor: 'var(--color-teal-50)' }}
                                    >
                                        <ArrowUpRight size={16} style={{ color: 'var(--color-teal-500)' }} />
                                    </div>
                                </div>
                                <div>
                                    <p
                                        className="text-5xl font-black leading-none mb-1"
                                        style={{ color: 'var(--color-teal-500)' }}
                                    >
                                        {upcomingCount}
                                    </p>
                                    <p
                                        className="text-xs font-semibold"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        à venir (7j)
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Ligne 2 — Animaux + Rappels ──────── */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                            {/* Colonne animaux */}
                            <div className="lg:col-span-2 card p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2
                                        className="title-serif text-lg"
                                    >
                                        Mes animaux
                                    </h2>
                                    <button
                                        onClick={() => navigate('/animals')}
                                        className="flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70"
                                        style={{ color: 'var(--color-orange-500)' }}
                                    >
                                        Voir tous
                                        <ArrowRight size={12} />
                                    </button>
                                </div>

                                {/* Liste animaux */}
                                <div className="flex flex-col gap-3">
                                    {animals.slice(0, 4).map(animal => (
                                        <div
                                            key={animal._id}
                                            className="flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all duration-200 hover:opacity-80"
                                            style={{ backgroundColor: 'var(--color-bg)' }}
                                            onClick={() => navigate(`/animals/${animal._id}`)}
                                        >
                                            <Avatar
                                                src={animal.photo}
                                                name={animal.name}
                                                size="md"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className="font-bold text-sm truncate"
                                                    style={{ color: 'var(--color-text-primary)' }}
                                                >
                                                    {animal.name}
                                                </p>
                                                <p
                                                    className="text-xs font-semibold"
                                                    style={{ color: 'var(--color-text-muted)' }}
                                                >
                                                    {SPECIES_LABELS[animal.species]}
                                                </p>
                                            </div>
                                            <ArrowUpRight
                                                size={16}
                                                style={{ color: 'var(--color-text-muted)' }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Bouton ajout */}
                                <button
                                    onClick={() => navigate('/animals/new')}
                                    className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-200 border-2 border-dashed hover:opacity-80"
                                    style={{
                                        borderColor: 'var(--color-border-md)',
                                        color: 'var(--color-text-muted)',
                                    }}
                                >
                                    <Plus size={16} />
                                    Ajouter un animal
                                </button>
                            </div>

                            {/* Colonne rappels */}
                            <div className="card p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="title-serif text-lg">
                                        Rappels
                                    </h2>
                                    <button
                                        onClick={() => navigate('/reminders')}
                                        className="flex items-center gap-1 text-xs font-bold transition-opacity hover:opacity-70"
                                        style={{ color: 'var(--color-orange-500)' }}
                                    >
                                        Tous
                                        <ArrowRight size={12} />
                                    </button>
                                </div>

                                {urgentReminders.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                                            style={{ backgroundColor: 'var(--color-teal-50)' }}
                                        >
                                            <Bell size={20} style={{ color: 'var(--color-teal-400)' }} />
                                        </div>
                                        <p
                                            className="text-sm font-bold mb-1"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            Tout est à jour
                                        </p>
                                        <p
                                            className="text-xs font-semibold"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            Aucun rappel urgent
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {urgentReminders.map(reminder => (
                                            <div
                                                key={reminder._id}
                                                className="flex items-start gap-3 p-3 rounded-2xl"
                                                style={{
                                                    backgroundColor: isOverdue(reminder.dueDate)
                                                        ? 'rgba(224, 62, 62, 0.05)'
                                                        : 'var(--color-orange-50)',
                                                }}
                                            >
                                                <div
                                                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                                                    style={{
                                                        backgroundColor: isOverdue(reminder.dueDate)
                                                            ? 'rgba(224, 62, 62, 0.15)'
                                                            : 'var(--color-orange-100)',
                                                    }}
                                                >
                                                    {isOverdue(reminder.dueDate)
                                                        ? <AlertCircle size={14} style={{ color: 'var(--color-error)' }} />
                                                        : <Bell size={14} style={{ color: 'var(--color-orange-500)' }} />
                                                    }
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className="text-xs font-bold truncate mb-0.5"
                                                        style={{ color: 'var(--color-text-primary)' }}
                                                    >
                                                        {reminder.title}
                                                    </p>
                                                    <p
                                                        className="text-xs font-semibold"
                                                        style={{ color: 'var(--color-text-muted)' }}
                                                    >
                                                        {reminder.animalId?.name}
                                                    </p>
                                                    <p
                                                        className="text-xs"
                                                        style={{
                                                            color: isOverdue(reminder.dueDate)
                                                                ? 'var(--color-error)'
                                                                : 'var(--color-text-muted)',
                                                        }}
                                                    >
                                                        {formatDate(reminder.dueDate)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Ligne 3 — Tip du jour ─────────────── */}
                        {tip && (
                            <div
                                className="rounded-2xl p-6 flex items-center gap-5"
                                style={{
                                    background: 'var(--gradient-teal)',
                                }}
                            >
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl"
                                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                >
                                    {tip.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles size={14} color="white" />
                                        <p
                                            className="text-xs font-black uppercase tracking-widest"
                                            style={{ color: 'rgba(255,255,255,0.8)' }}
                                        >
                                            Conseil du jour
                                        </p>
                                    </div>
                                    <p className="text-sm font-bold text-white">
                                        {tip.content}
                                    </p>
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Dashboard;