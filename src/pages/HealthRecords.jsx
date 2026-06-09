import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Stethoscope, ArrowUpRight } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import HealthRecordDetailModal from '../components/features/animals/modals/HealthRecordDetailModal';
import animalService from '../services/animal.service';
import healthRecordService from '../services/healthRecord.service';
import { formatDate } from '../utils/formatters';
import { HEALTH_TYPE_LABELS } from '../utils/constants';

const HealthRecords = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [animal, setAnimal] = useState(null);
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [animalData, recordsData] = await Promise.all([
                    animalService.getById(id),
                    healthRecordService.getByAnimal(id),
                ]);
                setAnimal(animalData);
                setRecords(recordsData.records);
            } catch (err) {
                console.error('Erreur chargement :', err);
                navigate(`/animals/${id}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleUpdate = (updated) => {
        setRecords(prev => prev.map(r => r._id === updated._id ? updated : r));
    };
    const handleDelete = (recordId) => {
        setRecords(prev => prev.filter(r => r._id !== recordId));
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingRecords = records.filter(r => new Date(r.date) >= today);
    const pastRecords = records.filter(r => new Date(r.date) < today);

    if (isLoading) return <Spinner fullPage />;

    // Composant partagé pour une ligne de record
    const RecordRow = ({ record, isPast = false }) => (
        <div
            key={record._id}
            className="card p-4 cursor-pointer transition-all duration-200 card-hover"
            style={{ opacity: isPast ? 0.65 : 1 }}
            onClick={() => setSelected(record)}
        >
            <div className="flex items-center gap-4">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: isPast ? 'var(--color-bg)' : 'var(--color-teal-50)' }}
                >
                    <Stethoscope size={18} style={{ color: isPast ? 'var(--color-text-muted)' : 'var(--color-teal-400)' }} />
                </div>
                <div className="flex-1 min-w-0">
                    <p
                        className="text-sm font-bold truncate mb-0.5"
                        style={{ color: isPast ? 'var(--color-text-muted)' : 'var(--color-text-primary)' }}
                    >
                        {record.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{
                                backgroundColor: isPast ? 'var(--color-border)' : 'var(--color-teal-50)',
                                color: isPast ? 'var(--color-text-muted)' : 'var(--color-teal-600)',
                            }}
                        >
                            {HEALTH_TYPE_LABELS[record.type]}
                        </span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                            {formatDate(record.date)}
                        </span>
                        {isPast && (
                            <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                            >
                                Passé
                            </span>
                        )}
                    </div>
                </div>
                <ArrowUpRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            </div>
            {record.description && (
                <p className="text-xs font-semibold mt-2 ml-14 truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {record.description}
                </p>
            )}
        </div>
    );

    return (
        <PageWrapper title="Suivi santé">
            <div className="max-w-3xl mx-auto animate-fadeIn">

                {/* ─────────── En-tête ─────────── */}
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={() => navigate(`/animals/${id}`)}
                        className="p-2 rounded-xl cursor-pointer transition-all duration-200"
                        style={{ backgroundColor: 'white', border: '1.5px solid var(--color-border)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-orange-400)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                    >
                        <ArrowLeft size={18} style={{ color: 'var(--color-text-muted)' }} />
                    </button>
                    <div className="flex-1 min-w-0">
                        <h1
                            className="text-2xl font-bold"
                            style={{ fontFamily: 'var(--font-syne)', color: 'var(--color-text-primary)' }}
                        >
                            Suivi santé
                        </h1>
                        {animal && (
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-muted)' }}>
                                {animal.name} · {records.length} record{records.length > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>
                    <Button leftIcon={<Plus size={16} />} onClick={() => navigate(`/animals/${id}/health-records/new`)}>
                        Ajouter
                    </Button>
                </div>

                {/* ─────────── Onglets ─────────── */}
                <div
                    className="flex gap-1 p-1 rounded-2xl mb-6"
                    style={{ backgroundColor: 'var(--color-border)' }}
                >
                    {[
                        { key: 'upcoming', label: `À venir (${upcomingRecords.length})` },
                        { key: 'past', label: `Passés (${pastRecords.length})` },
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className="flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer"
                            style={{
                                backgroundColor: activeTab === tab.key ? 'white' : 'transparent',
                                color: activeTab === tab.key ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                                boxShadow: activeTab === tab.key ? 'var(--shadow-sm)' : 'none',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ─────────── Contenu ─────────── */}
                {activeTab === 'upcoming' && (
                    upcomingRecords.length === 0 ? (
                        <EmptyState
                            icon={<Stethoscope size={28} />}
                            title="Aucun suivi à venir"
                            description="Les prochains rendez-vous et suivis apparaîtront ici."
                            action={
                                <Button leftIcon={<Plus size={16} />} onClick={() => navigate(`/animals/${id}/health-records/new`)}>
                                    Ajouter un suivi
                                </Button>
                            }
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {upcomingRecords.map(r => <RecordRow key={r._id} record={r} />)}
                        </div>
                    )
                )}

                {activeTab === 'past' && (
                    pastRecords.length === 0 ? (
                        <EmptyState
                            icon={<Stethoscope size={28} />}
                            title="Aucun suivi passé"
                            description="L'historique de vos suivis apparaîtra ici."
                        />
                    ) : (
                        <div className="flex flex-col gap-3">
                            {pastRecords.map(r => <RecordRow key={r._id} record={r} isPast />)}
                        </div>
                    )
                )}
            </div>

            <HealthRecordDetailModal
                record={selected}
                animalId={id}
                onClose={() => setSelected(null)}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />
        </PageWrapper>
    );
};

export default HealthRecords;