import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PawPrint } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import AnimalCard from '../components/features/animals/AnimalCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import animalService from '../services/animal.service';

const Animals = () => {
    const navigate = useNavigate();

    const [animals, setAnimals]   = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const data = await animalService.getAll();
                setAnimals(data.animals);
            } catch (err) {
                console.error('Erreur chargement animaux :', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnimals();
    }, []);

    if (isLoading) return <Spinner fullPage />;

    return (
        <PageWrapper title="Mes animaux">
            <div className="max-w-5xl mx-auto animate-fadeIn">

                {/* ────────────────── En-tête ────────────────── */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h1
                            className="text-2xl md:text-3xl font-bold mb-1"
                            style={{
                                fontFamily: 'var(--font-syne)',
                                color: 'var(--color-text-primary)',
                            }}
                        >
                            Mes animaux
                        </h1>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: 'var(--color-text-muted)' }}
                        >
                            {animals.length === 0
                                ? 'Aucun animal enregistré'
                                : `${animals.length} animal${animals.length > 1 ? 's' : ''} suivi${animals.length > 1 ? 's' : ''}`
                            }
                        </p>
                    </div>

                    {animals.length > 0 && (
                        <Button
                            leftIcon={<Plus size={16} />}
                            onClick={() => navigate('/animals/new')}
                        >
                            Ajouter
                        </Button>
                    )}
                </div>

                {/* ────────────────── Contenu ────────────────── */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {animals.map(animal => (
                            <AnimalCard key={animal._id} animal={animal} />
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    );
};

export default Animals;