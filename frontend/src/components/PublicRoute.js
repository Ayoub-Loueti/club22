// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('login'); // Adjust based on how you handle authentication

  return isAuthenticated ? <Navigate to="/profil" /> : children;
};

export default PublicRoute;
