// PublicRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('login'); // Adjust based on how you handle authentication
  const userId = JSON.parse(localStorage.getItem('userId'));

  return isAuthenticated ? <Navigate to={`/profil/${userId}`} /> : children;
};

export default PublicRoute;

