import { useNavigate } from 'react-router-dom';
import { PawPrint, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen flex items-center justify-center p-5"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            <div className="text-center max-w-sm">

                {/* Icône */}
                <div
                    className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'var(--gradient-orange)' }}
                >
                    <PawPrint size={36} color="white" />
                </div>

                {/* Texte */}
                <h1
                    className="text-6xl font-black mb-3"
                    style={{
                        fontFamily: 'var(--font-syne)',
                        color: 'var(--color-text-primary)',
                    }}
                >
                    404
                </h1>
                <p
                    className="text-lg font-bold mb-2"
                    style={{ color: 'var(--color-text-primary)' }}
                >
                    Page introuvable
                </p>
                <p
                    className="text-sm font-semibold mb-8"
                    style={{ color: 'var(--color-text-muted)' }}
                >
                    Cette page n'existe pas ou a été déplacée.
                </p>

                <Button
                    leftIcon={<ArrowLeft size={16} />}
                    onClick={() => navigate('/')}
                >
                    Retour à l'accueil
                </Button>
            </div>
        </div>
    );
};

export default NotFound;