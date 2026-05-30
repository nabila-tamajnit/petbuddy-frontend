import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, ArrowUpRight, AlertCircle,
    ChevronLeft, ChevronRight,
} from 'lucide-react';
import Button from '../../ui/Button';
import { formatDate, isOverdue, isUpcoming } from '../../../utils/formatters';
import { REMINDER_TYPE_LABELS } from '../../../utils/constants';

/**
 * Card rappels avec mini-calendrier
 *
 * @param {string}   animalId  - id de l'animal
 * @param {array}    reminders - liste des rappels
 * @param {function} onSelect  - callback quand on clique sur un rappel
 */
const AnimalRemindersCard = ({ animalId, reminders, onSelect }) => {
    const navigate = useNavigate();

    const today = new Date();
    const [currentDate, setCurrentDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );
    // Jour sélectionné dans le calendrier
    const [selectedDay, setSelectedDay] = useState(null);

    const year  = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = new Date(year, month, 1).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
    });

    const daysInMonth     = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset     = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    // Map jour → rappels de ce jour
    const remindersByDay = reminders.reduce((acc, r) => {
        const d = new Date(r.dueDate);
        if (d.getFullYear() === year && d.getMonth() === month) {
            const day = d.getDate();
            if (!acc[day]) acc[day] = [];
            acc[day].push(r);
        }
        return acc;
    }, {});

    // Rappels du jour sélectionné
    const selectedDayReminders = selectedDay
        ? (remindersByDay[selectedDay] ?? [])
        : [];

    const prevMonth = () => {
        setSelectedDay(null);
        setCurrentDate(new Date(year, month - 1, 1));
    };
    const nextMonth = () => {
        setSelectedDay(null);
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleDayClick = (day) => {
        // Si le jour a des rappels ou si on re-clique → toggle
        if (selectedDay === day) {
            setSelectedDay(null);
        } else if (remindersByDay[day]) {
            setSelectedDay(day);
        }
    };

    const pendingReminders = reminders.filter(r => r.status === 'pending');

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
                <h2
                    className="text-xs font-black uppercase tracking-widest"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Rappels
                    {pendingReminders.length > 0 && (
                        <span
                            className="ml-2 px-2 py-0.5 rounded-full text-xs"
                            style={{
                                backgroundColor: 'var(--color-orange-100)',
                                color: 'var(--color-orange-600)',
                            }}
                        >
                            {pendingReminders.length}
                        </span>
                    )}
                </h2>
                <Button
                    variant="ghost"
                    leftIcon={<Plus size={14} />}
                    onClick={() => navigate(`/animals/${animalId}/reminders/new`)}
                >
                    Ajouter
                </Button>
            </div>

            {/* ─────────────── Calendrier ─────────────── */}
            <div
                className="rounded-xl p-3 mb-4"
                style={{ backgroundColor: 'var(--color-bg)' }}
            >
                {/* Navigation mois */}
                <div className="flex items-center justify-between mb-2">
                    <button
                        onClick={prevMonth}
                        className="p-1 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-70"
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <ChevronLeft size={12} style={{ color: 'var(--color-text-muted)' }} />
                    </button>
                    <p
                        className="text-xs font-bold capitalize"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {monthName}
                    </p>
                    <button
                        onClick={nextMonth}
                        className="p-1 rounded-lg cursor-pointer transition-all duration-200 hover:opacity-70"
                        style={{
                            backgroundColor: 'white',
                            border: '1px solid var(--color-border)',
                        }}
                    >
                        <ChevronRight size={12} style={{ color: 'var(--color-text-muted)' }} />
                    </button>
                </div>

                {/* Jours de la semaine */}
                <div className="grid grid-cols-7 mb-0.5">
                    {['L','M','M','J','V','S','D'].map((d, i) => (
                        <div
                            key={i}
                            className="text-center py-0.5"
                            style={{
                                fontSize: '9px',
                                fontWeight: 700,
                                color: 'var(--color-text-muted)',
                            }}
                        >
                            {d}
                        </div>
                    ))}
                </div>

                {/* Grille des jours */}
                <div className="grid grid-cols-7 gap-0.5">
                    {Array.from({ length: startOffset }).map((_, i) => (
                        <div key={`e-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day        = i + 1;
                        const isToday    = today.getDate() === day
                            && today.getMonth() === month
                            && today.getFullYear() === year;
                        const isSelected = selectedDay === day;
                        const dayReminders = remindersByDay[day] ?? [];
                        const hasReminder  = dayReminders.length > 0;
                        const hasOverdue   = dayReminders.some(r => isOverdue(r.dueDate));
                        const isClickable  = hasReminder;

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className="flex flex-col items-center justify-center relative"
                                style={{
                                    height: '24px',
                                    borderRadius: '6px',
                                    cursor: isClickable ? 'pointer' : 'default',
                                    backgroundColor: isSelected
                                        ? 'var(--color-orange-400)'
                                        : isToday
                                            ? 'var(--color-orange-100)'
                                            : 'transparent',
                                    transition: 'background-color 0.15s',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: isToday || isSelected ? 700 : 500,
                                        color: isSelected
                                            ? 'white'
                                            : isToday
                                                ? 'var(--color-orange-600)'
                                                : 'var(--color-text-primary)',
                                        lineHeight: 1,
                                    }}
                                >
                                    {day}
                                </span>

                                {/* Point rappel */}
                                {hasReminder && !isSelected && (
                                    <div
                                        style={{
                                            width: '3px',
                                            height: '3px',
                                            borderRadius: '50%',
                                            backgroundColor: hasOverdue
                                                ? 'var(--color-error)'
                                                : 'var(--color-orange-400)',
                                            position: 'absolute',
                                            bottom: '2px',
                                        }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Rappels du jour sélectionné */}
                {selectedDay && selectedDayReminders.length > 0 && (
                    <div
                        className="mt-3 pt-3"
                        style={{ borderTop: '1px solid var(--color-border)' }}
                    >
                        <p
                            className="text-xs font-black uppercase tracking-widest mb-2"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {selectedDay} {monthName}
                        </p>
                        <div className="flex flex-col gap-1.5">
                            {selectedDayReminders.map(r => (
                                <div
                                    key={r._id}
                                    className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: 'white' }}
                                    onClick={() => onSelect(r)}
                                >
                                    <div
                                        style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            flexShrink: 0,
                                            backgroundColor: isOverdue(r.dueDate)
                                                ? 'var(--color-error)'
                                                : 'var(--color-orange-400)',
                                        }}
                                    />
                                    <p
                                        className="text-xs font-semibold flex-1 truncate"
                                        style={{ color: 'var(--color-text-primary)' }}
                                    >
                                        {r.title}
                                    </p>
                                    <ArrowUpRight size={11} style={{ color: 'var(--color-text-muted)' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ─────────────── Liste rappels en attente ─────────────── */}
            {pendingReminders.length === 0 ? (
                <p
                    className="text-sm font-semibold text-center py-3"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Aucun rappel en attente
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {pendingReminders.slice(0, 3).map(reminder => (
                        <div
                            key={reminder._id}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:opacity-80"
                            style={{
                                backgroundColor: isOverdue(reminder.dueDate)
                                    ? 'rgba(224, 62, 62, 0.05)'
                                    : isUpcoming(reminder.dueDate)
                                        ? 'var(--color-orange-50)'
                                        : 'var(--color-bg)',
                            }}
                            onClick={() => onSelect(reminder)}
                        >
                            <div
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    flexShrink: 0,
                                    backgroundColor: isOverdue(reminder.dueDate)
                                        ? 'var(--color-error)'
                                        : isUpcoming(reminder.dueDate)
                                            ? 'var(--color-orange-400)'
                                            : 'var(--color-border-md)',
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p
                                    className="text-sm font-bold truncate"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {reminder.title}
                                </p>
                                <p
                                    className="text-xs font-semibold"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    {REMINDER_TYPE_LABELS[reminder.type]} · {formatDate(reminder.dueDate)}
                                </p>
                            </div>
                            {isOverdue(reminder.dueDate) && (
                                <AlertCircle size={14} style={{ color: 'var(--color-error)' }} />
                            )}
                            <ArrowUpRight
                                size={14}
                                style={{ color: 'var(--color-text-muted)' }}
                            />
                        </div>
                    ))}

                    {pendingReminders.length > 3 && (
                        <p
                            className="text-xs font-bold text-center pt-1 cursor-pointer hover:opacity-70 transition-opacity"
                            style={{ color: 'var(--color-orange-500)' }}
                        >
                            +{pendingReminders.length - 3} autres rappels
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AnimalRemindersCard;