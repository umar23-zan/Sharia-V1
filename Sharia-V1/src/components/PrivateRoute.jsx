import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('userEmail');
    return isAuthenticated ? children : <Navigate to="/signup" />;
};

export default PrivateRoute;
