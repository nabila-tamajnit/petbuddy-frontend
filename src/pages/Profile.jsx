import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Trash2, RotateCcw, PawPrint, AlertTriangle } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Modal from '../components/ui/Modal';
import AnimalAvatar from '../components/ui/AnimalAvatar';
import useAuth from '../hooks/useAuth';
import userService from '../services/user.service';
import animalService from '../services/animal.service';
import { formatDate } from '../utils/formatters';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [profile, setProfile] = useState(null);
    const [archivedAnimals, setArchivedAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // ─────────────────── Modals ───────────────────
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRestoring, setIsRestoring] = useState(null); // id de l'animal en cours

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, archivedData] = await Promise.all([
                    userService.getMe(),
                    animalService.getArchived(),
                ]);
                setProfile(profileData);
                setArchivedAnimals(archivedData.animals);
            } catch (err) {
                console.error('Erreur chargement profil :', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ─────────────────── Supprimer le compte ───────────────────
    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        try {
            await userService.deleteAccount();
            logout();
            navigate('/');
        } catch (err) {
            console.error('Erreur suppression compte :', err);
        } finally {
            setIsDeleting(false);
        }
    };

    // La confirmation requiert de taper "SUPPRIMER"
    const canDelete = confirmText === 'SUPPRIMER';

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title="Profil">
            <div className="max-w-2xl mx-auto animate-fadeIn">

                {/* ─────────────────── En-tête ─────────────────── */}
                <div className="mb-8">
                    <h1
                        className="text-2xl md:text-3xl font-bold mb-1"
                        style={{
                            fontFamily: 'var(--font-syne)',
                            color: 'var(--color-text-primary)',
                        }}
                    >
                        Mon profil
                    </h1>
                    <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        Vos informations et paramètres
                    </p>
                </div>

                <div className="flex flex-col gap-5">

                    {/* ─────────────────── Card infos personnelles ─────────────────── */}
                    <div className="card p-6">
                        <h2
                            className="text-xs font-black uppercase tracking-widest mb-5"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Informations personnelles
                        </h2>

                        {/* Avatar initiales */}
                        <div className="flex items-center gap-4 mb-6">
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                                style={{ background: 'var(--gradient-orange)' }}
                            >
                                <span className="text-xl font-black text-white">
                                    {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                </span>
                            </div>
                            <div>
                                <p
                                    className="text-lg font-bold"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    {profile?.firstName} {profile?.lastName}
                                </p>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Membre PetBuddy
                                </p>
                            </div>
                        </div>

                        {/* Infos */}
                        <div className="flex flex-col gap-3">
                            {[
                                {
                                    icon: User,
                                    label: 'Nom complet',
                                    value: `${profile?.firstName} ${profile?.lastName}`,
                                },
                                {
                                    icon: Mail,
                                    label: 'Email',
                                    value: profile?.email,
                                },
                                {
                                    icon: Calendar,
                                    label: 'Membre depuis',
                                    value: formatDate(profile?.createdAt),
                                },
                            ].map(({ icon: Icon, label, value }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-3 p-3 rounded-xl"
                                    style={{ backgroundColor: 'var(--color-bg)' }}
                                >
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: 'var(--color-orange-50)' }}
                                    >
                                        <Icon size={14} style={{ color: 'var(--color-orange-400)' }} />
                                    </div>
                                    <div className="min-w-0">
                                        <p
                                            className="text-xs font-semibold"
                                            style={{ color: 'var(--color-text-muted)' }}
                                        >
                                            {label}
                                        </p>
                                        <p
                                            className="text-sm font-bold truncate"
                                            style={{ color: 'var(--color-text-primary)' }}
                                        >
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ─────────────────── Card animaux archivés ─────────────────── */}
                    <div className="card p-6">
                        <h2
                            className="text-xs font-black uppercase tracking-widest mb-4"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Animaux archivés
                        </h2>

                        {archivedAnimals.length === 0 ? (
                            <div className="flex items-center gap-3 py-4">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: 'var(--color-orange-50)' }}
                                >
                                    <PawPrint size={18} style={{ color: 'var(--color-orange-300)' }} />
                                </div>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    Aucun animal archivé
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {archivedAnimals.map(animal => (
                                    <div
                                        key={animal._id}
                                        className="flex items-center gap-3 p-3 rounded-xl"
                                        style={{ backgroundColor: 'var(--color-bg)' }}
                                    >
                                        <AnimalAvatar
                                            src={animal.photo}
                                            species={animal.species}
                                            name={animal.name}
                                            size="sm"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm font-bold truncate"
                                                style={{ color: 'var(--color-text-primary)' }}
                                            >
                                                {animal.name}
                                            </p>
                                            <p
                                                className="text-xs font-semibold"
                                                style={{ color: 'var(--color-text-muted)' }}
                                            >
                                                Archivé
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            leftIcon={<RotateCcw size={13} />}
                                            isLoading={isRestoring === animal._id}
                                            onClick={async () => {
                                                setIsRestoring(animal._id);
                                                try {
                                                    await animalService.restore(animal._id);
                                                    setArchivedAnimals(prev =>
                                                        prev.filter(a => a._id !== animal._id)
                                                    );
                                                } catch (err) {
                                                    console.error(err);
                                                } finally {
                                                    setIsRestoring(null);
                                                }
                                            }}
                                        >
                                            Restaurer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ─────────────────── Zone danger ─────────────────── */}
                    <div
                        className="card p-6"
                        style={{
                            borderColor: 'rgba(224, 62, 62, 0.2)',
                            backgroundColor: 'rgba(224, 62, 62, 0.02)',
                        }}
                    >
                        <div className="flex items-start gap-3 mb-4">
                            <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: 'rgba(224, 62, 62, 0.1)' }}
                            >
                                <AlertTriangle size={16} style={{ color: 'var(--color-error)' }} />
                            </div>
                            <div>
                                <h2
                                    className="text-sm font-black uppercase tracking-widest mb-1"
                                    style={{ color: 'var(--color-error)' }}
                                >
                                    Zone danger
                                </h2>
                                <p
                                    className="text-xs font-semibold"
                                    style={{ color: 'var(--color-text-muted)' }}
                                >
                                    La suppression du compte est irréversible. Toutes vos données
                                    seront définitivement effacées.
                                </p>
                            </div>
                        </div>

                        <Button
                            variant="danger"
                            leftIcon={<Trash2 size={15} />}
                            onClick={() => setShowDeleteModal(true)}
                        >
                            Supprimer mon compte
                        </Button>
                    </div>
                </div>
            </div>

            {/* ─────────────────── Modal suppression compte ─────────────────── */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setConfirmText('');
                }}
                title="Supprimer mon compte"
                size="sm"
            >
                <div className="flex flex-col gap-4">
                    <div
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: 'rgba(224,62,62,0.06)' }}
                    >
                        <p
                            className="text-sm font-bold mb-1"
                            style={{ color: 'var(--color-error)' }}
                        >
                            Cette action est irréversible
                        </p>
                        <p
                            className="text-xs"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            Tous vos animaux, rappels, suivis de santé et logs bien-être
                            seront définitivement supprimés.
                        </p>
                    </div>

                    {/* Double confirmation — taper SUPPRIMER */}
                    <div className="flex flex-col gap-2">
                        <label
                            className="label-field"
                            htmlFor="confirm"
                        >
                            Tapez <strong>SUPPRIMER</strong> pour confirmer
                        </label>
                        <input
                            id="confirm"
                            type="text"
                            value={confirmText}
                            onChange={e => setConfirmText(e.target.value)}
                            placeholder="SUPPRIMER"
                            className="input-field"
                        />
                    </div>

                    <div className="flex gap-3 justify-end mt-2">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setConfirmText('');
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="danger"
                            disabled={!canDelete}
                            isLoading={isDeleting}
                            leftIcon={<Trash2 size={13} />}
                            onClick={handleDeleteAccount}
                        >
                            Supprimer définitivement
                        </Button>
                    </div>
                </div>
            </Modal>
        </PageWrapper>
    );
};

export default Profile;