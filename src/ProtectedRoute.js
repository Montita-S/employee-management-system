import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

const ProtectedRoute = ({ children }) => {
    const { user } = useUser();

    if (!user.id_employee) {

        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
