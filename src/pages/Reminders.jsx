import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle, CheckCircle, Calendar, ArrowUpRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import AnimalAvatar from '../components/ui/AnimalAvatar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import ReminderRow from '../components/features/reminders/ReminderRow';
import reminderService from '../services/reminder.service';
import { formatDate, isOverdue, isUpcoming } from '../utils/formatters';
import { REMINDER_TYPE_LABELS } from '../utils/constants';

const Reminders = () => {
    const navigate = useNavigate();

    const [reminders, setReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected]   = useState(null);
    const [isMarking, setIsMarking] = useState(false);

    // ─────────── Onglet actif : 'upcoming' ou 'past' ───────────
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const data = await reminderService.getPending();
                setReminders(data.reminders);
            } catch (err) {
                console.error('Erreur chargement rappels :', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReminders();
    }, []);

    const handleMarkDone = async () => {
        if (!selected) return;
        setIsMarking(true);
        try {
            await reminderService.markAsDone(selected.animalId._id, selected._id);
            setReminders(prev => prev.filter(r => r._id !== selected._id));
            setSelected(null);
        } catch (err) {
            console.error('Erreur mark done :', err);
        } finally {
            setIsMarking(false);
        }
    };

    // ─────────── Séparation à venir / passés ───────────
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingReminders = reminders.filter(r => new Date(r.dueDate) >= today);
    const pastReminders     = reminders.filter(r => new Date(r.dueDate) < today);

    // Groupes pour À venir
    const overdue  = upcomingReminders.filter(r => isOverdue(r.dueDate));
    const upcoming = upcomingReminders.filter(r => !isOverdue(r.dueDate) && isUpcoming(r.dueDate));
    const later    = upcomingReminders.filter(r => !isOverdue(r.dueDate) && !isUpcoming(r.dueDate));

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title="Rappels">
            <div className="max-w-3xl mx-auto animate-fadeIn">

                {/* ─────────── En-tête ─────────── */}
                <div className="mb-6">
                    <h1
                        className="text-2xl md:text-3xl font-bold mb-1"
                        style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text-primary)' }}
                    >
                        Rappels
                    </h1>
                    <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                        {upcomingReminders.length === 0
                            ? 'Tout est à jour'
                            : `${upcomingReminders.length} rappel${upcomingReminders.length > 1 ? 's' : ''} en attente`
                        }
                    </p>
                </div>

                {/* ─────────── Onglets ─────────── */}
                <div
                    className="flex gap-1 p-1 rounded-2xl mb-6"
                    style={{ backgroundColor: 'var(--color-border)' }}
                >
                    {[
                        { key: 'upcoming', label: `À venir (${upcomingReminders.length})` },
                        { key: 'past',     label: `Passés (${pastReminders.length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
                            style={{
                                backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                                color: activeTab === tab.key
                                    ? 'var(--color-text-primary)'
                                    : 'var(--color-text-muted)',
                                boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ─────────── Contenu À venir ─────────── */}
                {activeTab === 'upcoming' && (
                    <>
                        {upcomingReminders.length === 0 ? (
                            <EmptyState
                                icon={<Bell size={28} />}
                                title="Aucun rappel en attente"
                                description="Tous vos rappels sont à jour."
                            />
                        ) : (
                            <div className="flex flex-col gap-8">
                                {overdue.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle size={16} style={{ color: 'var(--color-error)' }} />
                                            <h2 className="text-sm font-black uppercase tracking-widest"
                                                style={{ color: 'var(--color-error)' }}>
                                                En retard · {overdue.length}
                                            </h2>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {overdue.map(r => (
                                                <ReminderRow key={r._id} reminder={r} urgency="overdue"
                                                    onClick={() => setSelected(r)}
                                                    onNavigate={() => navigate(`/animals/${r.animalId._id}`)} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {upcoming.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Calendar size={16} style={{ color: 'var(--color-orange-400)' }} />
                                            <h2 className="text-sm font-black uppercase tracking-widest"
                                                style={{ color: 'var(--color-orange-500)' }}>
                                                Cette semaine · {upcoming.length}
                                            </h2>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {upcoming.map(r => (
                                                <ReminderRow key={r._id} reminder={r} urgency="upcoming"
                                                    onClick={() => setSelected(r)}
                                                    onNavigate={() => navigate(`/animals/${r.animalId._id}`)} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                                {later.length > 0 && (
                                    <section>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Bell size={16} style={{ color: 'var(--color-text-muted)' }} />
                                            <h2 className="text-sm font-black uppercase tracking-widest"
                                                style={{ color: 'var(--color-text-muted)' }}>
                                                À venir · {later.length}
                                            </h2>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {later.map(r => (
                                                <ReminderRow key={r._id} reminder={r} urgency="later"
                                                    onClick={() => setSelected(r)}
                                                    onNavigate={() => navigate(`/animals/${r.animalId._id}`)} />
                                            ))}
                                        </div>
                                    </section>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* ─────────── Contenu Passés ─────────── */}
                {activeTab === 'past' && (
                    <>
                        {pastReminders.length === 0 ? (
                            <EmptyState
                                icon={<CheckCircle size={28} />}
                                title="Aucun rappel passé"
                                description="Les rappels passés apparaîtront ici."
                            />
                        ) : (
                            <div className="flex flex-col gap-2">
                                {pastReminders.map(reminder => (
                                    <div
                                        key={reminder._id}
                                        className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:opacity-80"
                                        style={{
                                            backgroundColor: 'white',
                                            border: '1.5px solid var(--color-border)',
                                            opacity: 0.7,
                                        }}
                                        onClick={() => setSelected(reminder)}
                                    >
                                        <div
                                            onClick={e => { e.stopPropagation(); navigate(`/animals/${reminder.animalId._id}`); }}
                                            className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                                        >
                                            <AnimalAvatar
                                                src={reminder.animalId.photo}
                                                species={reminder.animalId.species}
                                                name={reminder.animalId.name}
                                                size="sm"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm font-semibold truncate"
                                                style={{ color: 'var(--color-text-muted)' }}
                                            >
                                                {reminder.title}
                                            </p>
                                            <p className="text-xs" style={{ color: 'var(--color-text-light)' }}>
                                                {reminder.animalId.name} · {REMINDER_TYPE_LABELS[reminder.type]} · {formatDate(reminder.dueDate)}
                                            </p>
                                        </div>
                                        {/* Badge passé */}
                                        <span
                                            className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                                            style={{
                                                backgroundColor: 'var(--color-border)',
                                                color: 'var(--color-text-muted)',
                                            }}
                                        >
                                            Passé
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ─────────── Modal détail ─────────── */}
            <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Détail du rappel" size="sm">
                {selected && (
                    <div className="flex flex-col gap-4">
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                            onClick={() => { navigate(`/animals/${selected.animalId._id}`); setSelected(null); }}
                        >
                            <AnimalAvatar
                                src={selected.animalId.photo}
                                species={selected.animalId.species}
                                name={selected.animalId.name}
                                size="sm"
                            />
                            <p className="text-sm font-bold flex-1" style={{ color: 'var(--color-text-primary)' }}>
                                {selected.animalId.name}
                            </p>
                            <ArrowUpRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </div>

                        <div>
                            <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-muted)' }}>
                                {REMINDER_TYPE_LABELS[selected.type]}
                            </p>
                            <p className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>
                                {selected.title}
                            </p>
                        </div>

                        {selected.description && (
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                {selected.description}
                            </p>
                        )}

                        <div
                            className="flex items-center gap-2 p-3 rounded-xl"
                            style={{
                                backgroundColor: isOverdue(selected.dueDate)
                                    ? 'rgba(224,62,62,0.08)'
                                    : 'var(--color-orange-50)',
                            }}
                        >
                            <Bell size={14} style={{ color: isOverdue(selected.dueDate) ? 'var(--color-error)' : 'var(--color-orange-500)' }} />
                            <p className="text-sm font-bold" style={{ color: isOverdue(selected.dueDate) ? 'var(--color-error)' : 'var(--color-orange-600)' }}>
                                {formatDate(selected.dueDate)}
                                {isOverdue(selected.dueDate) && ' — En retard'}
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end mt-2">
                            <Button variant="ghost" onClick={() => setSelected(null)}>Fermer</Button>
                            {selected.status === 'pending' && (
                                <Button variant="teal" leftIcon={<CheckCircle size={14} />} isLoading={isMarking} onClick={handleMarkDone}>
                                    Marquer comme fait
                                </Button>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </PageWrapper>
    );
};

export default Reminders;