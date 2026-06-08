import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, AlertCircle, CheckCircle, Calendar, ArrowUpRight, PawPrint } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import AnimalAvatar from '../components/ui/AnimalAvatar';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import reminderService from '../services/reminder.service';
import ReminderRow from '../components/features/reminders/ReminderRow';
import { formatDate, isOverdue, isUpcoming } from '../utils/formatters';
import { REMINDER_TYPE_LABELS } from '../utils/constants';

const Reminders = () => {
    const navigate = useNavigate();

    const [reminders, setReminders]   = useState([]);
    const [isLoading, setIsLoading]   = useState(true);
    const [selected, setSelected]     = useState(null);
    const [isMarking, setIsMarking]   = useState(false);

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

    // ──────────────────── Marquer comme fait ────────────────────
    const handleMarkDone = async () => {
        if (!selected) return;
        setIsMarking(true);
        try {
            await reminderService.markAsDone(
                selected.animalId._id,
                selected._id
            );
            // Retire le rappel de la liste localement
            setReminders(prev => prev.filter(r => r._id !== selected._id));
            setSelected(null);
        } catch (err) {
            console.error('Erreur mark done :', err);
        } finally {
            setIsMarking(false);
        }
    };

    // ──────────────────── Groupes ────────────────────
    const overdue  = reminders.filter(r => isOverdue(r.dueDate));
    const upcoming = reminders.filter(r => !isOverdue(r.dueDate) && isUpcoming(r.dueDate));
    const later    = reminders.filter(r => !isOverdue(r.dueDate) && !isUpcoming(r.dueDate));

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title="Rappels">
            <div className="max-w-3xl mx-auto animate-fadeIn">

                {/* ──────────────────── En-tête ──────────────────── */}
                <div className="mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold mb-1"
                        style={{
                            fontFamily: 'var(--font-syne)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        Rappels
                    </h1>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        {reminders.length === 0
                            ? 'Tout est à jour'
                            : `${reminders.length} rappel${reminders.length > 1 ? 's' : ''} en attente`
                        }
                    </p>
                </div>

                {reminders.length === 0 ? (
                    <EmptyState
                        icon={<Bell size={28} />}
                        title="Aucun rappel en attente"
                        description="Tous vos rappels sont à jour. Ajoutez-en depuis la page d'un animal."
                    />
                ) : (
                    <div className="flex flex-col gap-8">

                        {/* ──────────────────── En retard ──────────────────── */}
                        {overdue.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle size={16} style={{ color: 'var(--color-error)' }} />
                                    <h2
                                        className="text-sm font-black uppercase tracking-widest"
                                        style={{ color: 'var(--color-error)' }}
                                    >
                                        En retard · {overdue.length}
                                    </h2>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {overdue.map(reminder => (
                                        <ReminderRow
                                            key={reminder._id}
                                            reminder={reminder}
                                            urgency="overdue"
                                            onClick={() => setSelected(reminder)}
                                            onNavigate={() => navigate(`/animals/${reminder.animalId._id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ──────────────────── Cette semaine ──────────────────── */}
                        {upcoming.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar size={16} style={{ color: 'var(--color-orange-400)' }} />
                                    <h2
                                        className="text-sm font-black uppercase tracking-widest"
                                        style={{ color: 'var(--color-orange-500)' }}
                                    >
                                        Cette semaine · {upcoming.length}
                                    </h2>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {upcoming.map(reminder => (
                                        <ReminderRow
                                            key={reminder._id}
                                            reminder={reminder}
                                            urgency="upcoming"
                                            onClick={() => setSelected(reminder)}
                                            onNavigate={() => navigate(`/animals/${reminder.animalId._id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ──────────────────── À venir ──────────────────── */}
                        {later.length > 0 && (
                            <section>
                                <div className="flex items-center gap-2 mb-3">
                                    <Bell size={16} style={{ color: 'var(--color-text-muted)' }} />
                                    <h2
                                        className="text-sm font-black uppercase tracking-widest"
                                        style={{ color: 'var(--color-text-muted)' }}
                                    >
                                        À venir · {later.length}
                                    </h2>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {later.map(reminder => (
                                        <ReminderRow
                                            key={reminder._id}
                                            reminder={reminder}
                                            urgency="later"
                                            onClick={() => setSelected(reminder)}
                                            onNavigate={() => navigate(`/animals/${reminder.animalId._id}`)}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            {/* ──────────────────── Modal détail rappel ──────────────────── */}
            <Modal
                isOpen={!!selected}
                onClose={() => setSelected(null)}
                title="Détail du rappel"
                size="sm"
            >
                {selected && (
                    <div className="flex flex-col gap-4">

                        {/* Animal */}
                        <div
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                            onClick={() => {
                                navigate(`/animals/${selected.animalId._id}`);
                                setSelected(null);
                            }}
                        >
                            <AnimalAvatar
                                src={selected.animalId.photo}
                                species={selected.animalId.species}
                                name={selected.animalId.name}
                                size="sm"
                            />
                            <p
                                className="text-sm font-bold flex-1"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                {selected.animalId.name}
                            </p>
                            <ArrowUpRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                        </div>

                        {/* Infos rappel */}
                        <div>
                            <p
                                className="text-xs font-black uppercase tracking-widest mb-1"
                                style={{ color: 'var(--color-text-muted)' }}
                            >
                                {REMINDER_TYPE_LABELS[selected.type]}
                            </p>
                            <p
                                className="text-lg font-bold"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                {selected.title}
                            </p>
                        </div>

                        {selected.description && (
                            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                                {selected.description}
                            </p>
                        )}

                        {/* Date */}
                        <div
                            className="flex items-center gap-2 p-3 rounded-xl"
                            style={{
                                backgroundColor: isOverdue(selected.dueDate)
                                    ? 'rgba(224,62,62,0.08)'
                                    : 'var(--color-orange-50)',
                            }}
                        >
                            <Bell
                                size={14}
                                style={{
                                    color: isOverdue(selected.dueDate)
                                        ? 'var(--color-error)'
                                        : 'var(--color-orange-500)',
                                }}
                            />
                            <p
                                className="text-sm font-bold"
                                style={{
                                    color: isOverdue(selected.dueDate)
                                        ? 'var(--color-error)'
                                        : 'var(--color-orange-600)',
                                }}
                            >
                                {formatDate(selected.dueDate)}
                                {isOverdue(selected.dueDate) && ' — En retard'}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end mt-2">
                            <Button
                                variant="ghost"
                                onClick={() => setSelected(null)}
                            >
                                Fermer
                            </Button>
                            <Button
                                variant="teal"
                                leftIcon={<CheckCircle size={14} />}
                                isLoading={isMarking}
                                onClick={handleMarkDone}
                            >
                                Marquer comme fait
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </PageWrapper>
    );
};

export default Reminders;