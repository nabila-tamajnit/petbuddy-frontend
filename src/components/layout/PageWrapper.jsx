import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * Entoure chaque page protégée avec la Navbar et la Sidebar
 *
 * @param {node}   children - contenu de la page
 * @param {string} title    - titre
 */
const PageWrapper = ({ children, title = '' }) => {
    return (
        // Conteneur racine
        <div className="min-h-screen flex flex-col"
             style={{ backgroundColor: 'var(--color-cream-50)' }}>

            {/* Navbar */}
            <Navbar title={title} />

            {/* Sidebar + contenu */}
            <div className="flex flex-1">

                {/* Sidebar */}
                <aside className="hidden lg:block">
                    <Sidebar />
                </aside>

                {/* Contenu de la page */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
                    {children}
                </main>
            </div>

            {/* Bottom Nav pour mobile */}
            <div className="lg:hidden">
                <Sidebar mobileBottom />
            </div>
        </div>
    );
};

export default PageWrapper;