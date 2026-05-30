import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import AnimalHeader from '../components/features/animals/AnimalHeader';
import AnimalInfoCard from '../components/features/animals/AnimalInfoCard';
import AnimalRemindersCard from '../components/features/animals/AnimalRemindersCard';
import AnimalHealthCard from '../components/features/animals/AnimalHealthCard';
import AnimalWellnessCard from '../components/features/animals/AnimalWellnessCard';
import ReminderDetailModal from '../components/features/animals/modals/ReminderDetailModal';
import HealthRecordDetailModal from '../components/features/animals/modals/HealthRecordDetailModal';
import WellnessDetailModal from '../components/features/animals/modals/WellnessDetailModal';
import animalService from '../services/animal.service';
import reminderService from '../services/reminder.service';
import healthRecordService from '../services/healthRecord.service';
import wellnessService from '../services/wellness.service';
import tipService from '../services/tip.service';

const AnimalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ───────────────────── Data ─────────────────────
    const [animal, setAnimal] = useState(null);
    const [reminders, setReminders] = useState([]);
    const [records, setRecords] = useState([]);
    const [wellness, setWellness] = useState([]);
    const [tip, setTip] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // ───────────────────── Modals ─────────────────────
    const [selectedReminder, setSelectedReminder] = useState(null);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [selectedWellness, setSelectedWellness] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPermanentDelete, setIsPermanentDelete] = useState(false);

    // ───────────────────── Chargement ─────────────────────
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [animalData, remindersData, recordsData, wellnessData] =
                    await Promise.all([
                        animalService.getById(id),
                        reminderService.getByAnimal(id),
                        healthRecordService.getByAnimal(id),
                        wellnessService.getByAnimal(id),
                    ]);

                setAnimal(animalData);
                setReminders(remindersData.reminders);
                setRecords(recordsData.records);
                setWellness(wellnessData.logs);

                // Tip selon l'espèce
                const tipData = await tipService.getBySpecies(animalData.species);
                if (tipData.tips.length > 0) setTip(tipData.tips[0]);

            } catch (err) {
                console.error('Erreur chargement animal :', err);
                navigate('/animals');
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    // ───────────────────── Handlers ─────────────────────

    // Archiver l'animal
    const handleArchive = async () => {
        setIsDeleting(true);
        try {
            await animalService.delete(id);
            navigate('/animals');
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Supprimer définitivement
    const handlePermanentDelete = async () => {
        setIsDeleting(true);
        try {
            await animalService.permanentDelete(id);
            navigate('/animals');
        } catch (err) {
            console.error(err);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // Marquer rappel comme fait
    const handleMarkDone = async (reminderId) => {
        try {
            await reminderService.markAsDone(id, reminderId);
            setReminders(prev =>
                prev.map(r => r._id === reminderId ? { ...r, status: 'done' } : r)
            );
            setSelectedReminder(null);
        } catch (err) {
            console.error(err);
        }
    };

    // Modifier et supprimer — pour les 3 types
    const handleUpdateReminder = (updated) => {
        setReminders(prev =>
            prev.map(r => r._id === updated._id ? updated : r)
        );
    };

    const handleDeleteReminder = (reminderId) => {
        setReminders(prev => prev.filter(r => r._id !== reminderId));
    };

    const handleUpdateRecord = (updated) => {
        setRecords(prev =>
            prev.map(r => r._id === updated._id ? updated : r)
        );
    };

    const handleDeleteRecord = (recordId) => {
        setRecords(prev => prev.filter(r => r._id !== recordId));
    };

    const handleUpdateWellness = (updated) => {
        setWellness(prev =>
            prev.map(w => w._id === updated._id ? updated : w)
        );
    };

    const handleDeleteWellness = (logId) => {
        setWellness(prev => prev.filter(w => w._id !== logId));
    };

    if (isLoading) return <Spinner fullPage />;
    if (!animal) return null;

    return (
        <PageWrapper title={animal.name}>
            <div className="max-w-5xl mx-auto animate-fadeIn">

                {/* En-tête */}
                <AnimalHeader
                    animal={animal}
                    onAnimalUpdate={setAnimal}
                    onDeleteClick={() => setShowDeleteModal(true)}
                />

                {/* Grille */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* Colonne gauche */}
                    <div className="flex flex-col gap-5">
                        <AnimalInfoCard animal={animal} />
                        <AnimalWellnessCard
                            animalId={id}
                            logs={wellness}
                            tip={tip}
                            onSelect={setSelectedWellness}
                        />
                    </div>

                    {/* Colonne droite */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        <AnimalRemindersCard
                            animalId={id}
                            reminders={reminders}
                            onSelect={setSelectedReminder}
                        />
                        <AnimalHealthCard
                            animalId={id}
                            records={records}
                            onSelect={setSelectedRecord}
                        />
                    </div>
                </div>
            </div>

            {/* ───────────────────── Modals ───────────────────── */}
            <ReminderDetailModal
                reminder={selectedReminder}
                animalId={id}
                onClose={() => setSelectedReminder(null)}
                onMarkDone={handleMarkDone}
                onUpdate={handleUpdateReminder}
                onDelete={handleDeleteReminder}
            />

            <HealthRecordDetailModal
                record={selectedRecord}
                animalId={id}
                onClose={() => setSelectedRecord(null)}
                onUpdate={handleUpdateRecord}
                onDelete={handleDeleteRecord}
            />

            <WellnessDetailModal
                log={selectedWellness}
                animalId={id}
                animalSpecies={animal?.species}
                onClose={() => setSelectedWellness(null)}
                onUpdate={handleUpdateWellness}
                onDelete={handleDeleteWellness}
            />

            {/* Modal archiver / supprimer */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title={`Gérer ${animal.name}`}
                size="sm"
            >
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                    Choisissez une action pour {animal.name}.
                </p>

                {/* Option archiver */}
                <div
                    className="p-4 rounded-xl mb-3 cursor-pointer transition-all duration-200 hover:opacity-80"
                    style={{ backgroundColor: 'var(--color-orange-50)', border: '1.5px solid var(--color-orange-100)' }}
                    onClick={() => setIsPermanentDelete(false)}
                >
                    <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-orange-600)' }}>
                        Archiver
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {animal.name} sera caché mais ses données seront conservées. Vous pourrez le restaurer.
                    </p>
                </div>

                {/* Option supprimer définitivement */}
                <div
                    className="p-4 rounded-xl mb-5 cursor-pointer transition-all duration-200 hover:opacity-80"
                    style={{ backgroundColor: 'rgba(224,62,62,0.05)', border: '1.5px solid rgba(224,62,62,0.2)' }}
                    onClick={() => setIsPermanentDelete(true)}
                >
                    <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-error)' }}>
                        Supprimer définitivement
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {animal.name} et toutes ses données seront supprimés. Action irréversible.
                    </p>
                </div>

                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                        Annuler
                    </Button>
                    <Button
                        variant="danger"
                        isLoading={isDeleting}
                        leftIcon={<Trash2 size={14} />}
                        onClick={isPermanentDelete ? handlePermanentDelete : handleArchive}
                    >
                        {isPermanentDelete ? 'Supprimer définitivement' : 'Archiver'}
                    </Button>
                </div>
            </Modal>

        </PageWrapper>
    );
};

export default AnimalDetail;