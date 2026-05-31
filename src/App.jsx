import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import ReminderForm from './pages/ReminderForm';
import HealthRecordForm from './pages/HealthRecordForm';
import WellnessForm from './pages/WellnessForm';

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

                        {/* Animaux */}
                        <Route path="/animals" element={<Animals />} />
                        <Route path="/animals/new" element={<AnimalForm />} />
                        <Route path="/animals/:id" element={<AnimalDetail />} />
                        <Route path="/animals/:id/edit" element={<AnimalForm />} />

                        {/* Rappels */}
                        <Route path="/animals/:id/reminders/new" element={<ReminderForm />} />
                        <Route path="/animals/:id/reminders/:reminderId/edit" element={<ReminderForm />} />

                        {/* Health Records */}
                        <Route path="/animals/:id/health-records" element={<HealthRecords />} />
                        <Route path="/animals/:id/health-records/new" element={<HealthRecordForm />} />
                        <Route path="/animals/:id/health-records/:recordId/edit" element={<HealthRecordForm />} />

                        {/* Wellness */}
                        <Route path="/animals/:id/wellness/new" element={<WellnessForm />} />
                        <Route path="/animals/:id/wellness/:logId/edit" element={<WellnessForm />} />

                        {/* Autres */}
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