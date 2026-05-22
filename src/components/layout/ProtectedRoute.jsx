import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useContext(AuthContext);

    // Pendant la vérification du token, on affiche rien
    if (isLoading) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;