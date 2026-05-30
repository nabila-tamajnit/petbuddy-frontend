import Navbar from './Navbar';
import Sidebar from './Sidebar';

const PageWrapper = ({ children, title = '' }) => {
    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: 'var(--color-bg)' }}
        >
            {/* Navbar */}
            <Navbar title={title} />

            {/* Zone principale */}
            <div className="flex flex-1">

                {/* Sidebar desktop */}
                <aside
                    className="hidden lg:block flex-shrink-0 sticky top-16 self-start"
                    style={{ height: 'calc(100vh - 64px)' }}
                >
                    <Sidebar />
                </aside>

                {/* Contenu */}
                <main className="flex-1 p-5 md:p-7 lg:p-8 pb-24 lg:pb-8 min-h-[calc(100vh-64px)]">
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