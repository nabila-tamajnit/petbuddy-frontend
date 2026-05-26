import Navbar from './Navbar';
import Sidebar from './Sidebar';

/**
 * PageWrapper — layout principal des pages privées
 * @param {node}   children - contenu de la page
 * @param {string} title    - titre affiché en mobile
 */
const PageWrapper = ({ children, title = '' }) => {
    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            {/* Navbar */}
            <Navbar title={title} />

            {/* Zone principale */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar — desktop uniquement */}
                <aside className="hidden lg:flex flex-shrink-0 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto">
                    <Sidebar />
                </aside>

                {/* Contenu */}
                <main className="flex-1 overflow-y-auto p-5 md:p-7 lg:p-8 pb-24 lg:pb-8">
                    {children}
                </main>
            </div>

            {/* Bottom Nav mobile */}
            <div className="lg:hidden">
                <Sidebar mobileBottom />
            </div>
        </div>
    );
};

export default PageWrapper;