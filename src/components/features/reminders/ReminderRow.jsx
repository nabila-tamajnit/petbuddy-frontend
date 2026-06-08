import { ArrowUpRight } from 'lucide-react';
import AnimalAvatar from '../../ui/AnimalAvatar';
import { formatDate, isOverdue } from '../../../utils/formatters';
import { REMINDER_TYPE_LABELS } from '../../../utils/constants';

const URGENCY_STYLES = {
    overdue: {
        bg:     'rgba(224, 62, 62, 0.05)',
        border: 'rgba(224, 62, 62, 0.2)',
        dot:    'var(--color-error)',
    },
    upcoming: {
        bg:     'var(--color-orange-50)',
        border: 'var(--color-orange-100)',
        dot:    'var(--color-orange-400)',
    },
    later: {
        bg:     'white',
        border: 'var(--color-border)',
        dot:    'var(--color-border-md)',
    },
};

const ReminderRow = ({ reminder, urgency, onClick, onNavigate }) => {
    const style = URGENCY_STYLES[urgency];

    return (
        <div
            className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:opacity-80"
            style={{
                backgroundColor: style.bg,
                border: `1.5px solid ${style.border}`,
            }}
            onClick={onClick}
        >
            {/* Avatar animal */}
            <div
                onClick={e => { e.stopPropagation(); onNavigate(); }}
                className="flex-shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
            >
                <AnimalAvatar
                    src={reminder.animalId.photo}
                    species={reminder.animalId.species}
                    name={reminder.animalId.name}
                    size="sm"
                />
            </div>

            {/* Infos */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: style.dot }}
                    />
                    <p
                        className="text-sm font-bold truncate"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {reminder.title}
                    </p>
                </div>
                <p
                    className="text-xs font-semibold"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    {reminder.animalId.name} · {REMINDER_TYPE_LABELS[reminder.type]} · {formatDate(reminder.dueDate)}
                </p>
            </div>

            <ArrowUpRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
        </div>
    );
};

export default ReminderRow;