import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import AnimalAvatar from '../../ui/AnimalAvatar';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Modal from '../../ui/Modal';
import { GENDER_LABELS } from '../../../utils/constants';
import { calculateAge } from '../../../utils/formatters';
import cloudinaryService from '../../../services/cloudinary.service';
import animalService from '../../../services/animal.service';

/**
 * En-tête de la page AnimalDetail
 *
 * @param {object}   animal        - données de l'animal
 * @param {function} onAnimalUpdate - callback quand la photo change
 * @param {function} onDeleteClick  - callback pour ouvrir la modal de suppression
 */
const AnimalHeader = ({ animal, onAnimalUpdate, onDeleteClick }) => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [isUploading, setIsUploading]       = useState(false);

    // ─────────────────── Upload nouvelle photo ───────────────────
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation basique
        if (!file.type.startsWith('image/')) {
            alert('Veuillez choisir une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('L\'image ne doit pas dépasser 5MB');
            return;
        }

        setIsUploading(true);
        try {
            // 1. Upload vers Cloudinary → récupère l'URL
            const photoUrl = await cloudinaryService.upload(file, 'animals');

            // 2. Met à jour l'animal dans le backend avec la nouvelle URL
            const updatedAnimal = await animalService.update(animal._id, { photo: photoUrl });

            // 3. Notifie le parent pour mettre à jour le state
            onAnimalUpdate(updatedAnimal);
            setShowPhotoModal(false);
        } catch (err) {
            console.error('Erreur upload photo :', err);
            alert('Erreur lors de l\'upload. Réessayez.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div className="flex items-start gap-4 mb-8">

                {/* Bouton retour */}
                <button
                    onClick={() => navigate('/animals')}
                    className="mt-1 p-2 rounded-xl cursor-pointer transition-all duration-200 flex-shrink-0"
                    style={{
                        backgroundColor: 'white',
                        border: '1.5px solid var(--color-border)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-orange-400)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-border)'}
                >
                    <ArrowLeft size={18} style={{ color: 'var(--color-text-muted)' }} />
                </button>

                {/* Avatar cliquable */}
                <div className="relative flex-shrink-0">
                    <AnimalAvatar
                        src={animal.photo}
                        species={animal.species}
                        name={animal.name}
                        size="lg"
                        onClick={() => setShowPhotoModal(true)}
                    />
                    {/* Badge caméra */}
                    <div
                        className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
                        style={{
                            background: 'var(--gradient-orange)',
                        }}
                        onClick={() => setShowPhotoModal(true)}
                    >
                        <Camera size={11} color="white" />
                    </div>
                </div>

                {/* Infos */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h1
                                className="text-2xl font-bold truncate"
                                style={{
                                    fontFamily: 'var(--font-syne)',
                                    color: 'var(--color-text-primary)',
                                }}
                            >
                                {animal.name}
                            </h1>
                            <Badge variant="species" value={animal.species} />
                        </div>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {animal.breed ?? '—'} · {GENDER_LABELS[animal.gender]}
                            {calculateAge(animal.birthDate)
                                ? ` · ${calculateAge(animal.birthDate)}`
                                : ''
                            }
                        </p>
                    </div>
                </div>

                {/* Actions desktop */}
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                    <Button
                        variant="ghost"
                        leftIcon={<Edit size={15} />}
                        onClick={() => navigate(`/animals/${animal._id}/edit`)}
                    >
                        Modifier
                    </Button>
                    <Button
                        variant="danger"
                        leftIcon={<Trash2 size={15} />}
                        onClick={onDeleteClick}
                    >
                        Archiver
                    </Button>
                </div>
            </div>

            {/* Actions mobile */}
            <div className="flex md:hidden gap-3 mb-6">
                <Button
                    variant="ghost"
                    leftIcon={<Edit size={15} />}
                    fullWidth
                    onClick={() => navigate(`/animals/${animal._id}/edit`)}
                >
                    Modifier
                </Button>
                <Button
                    variant="danger"
                    leftIcon={<Trash2 size={15} />}
                    fullWidth
                    onClick={onDeleteClick}
                >
                    Archiver
                </Button>
            </div>

            {/* Input file caché */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* ─────────────────── Modal photo ─────────────────── */}
            <Modal
                isOpen={showPhotoModal}
                onClose={() => setShowPhotoModal(false)}
                title={animal.photo ? 'Photo de ' + animal.name : 'Ajouter une photo'}
                size="md"
            >
                <div className="flex flex-col items-center gap-5">

                    {/* Affichage grande photo ou avatar large */}
                    {animal.photo ? (
                        <img
                            src={animal.photo}
                            alt={animal.name}
                            className="w-full max-h-64 object-cover rounded-2xl"
                        />
                    ) : (
                        <AnimalAvatar
                            species={animal.species}
                            name={animal.name}
                            size="xl"
                        />
                    )}

                    {/* Bouton upload */}
                    <Button
                        variant="secondary"
                        leftIcon={<Camera size={16} />}
                        isLoading={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                        fullWidth
                    >
                        {animal.photo ? 'Changer la photo' : 'Ajouter une photo'}
                    </Button>

                    <p
                        className="text-xs text-center"
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        JPG, PNG ou WEBP · Max 5MB
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default AnimalHeader;