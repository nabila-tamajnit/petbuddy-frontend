import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Animals from './pages/Animals';
import AnimalDetail from './pages/AnimalDetail';
import AnimalForm from './pages/AnimalForm';
import HealthRecords from './pages/HealthRecords';
import Reminders from './pages/Reminders';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Routes publiques */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Routes privées */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/animals" element={<Animals />} />
                        <Route path="/animals/new" element={<AnimalForm />} />
                        <Route path="/animals/:id" element={<AnimalDetail />} />
                        <Route path="/animals/:id/edit" element={<AnimalForm />} />
                        <Route path="/animals/:id/health-records" element={<HealthRecords />} />
                        <Route path="/reminders" element={<Reminders />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;