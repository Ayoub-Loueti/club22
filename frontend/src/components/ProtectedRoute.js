import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('login'); // Assuming 'token' is the key where token is stored
  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;