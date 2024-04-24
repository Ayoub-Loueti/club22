import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ClientRestrictedRoute = ({ children }) => {
  const userType = JSON.parse(localStorage.getItem('userType')); // Get the user type from local storage
  const location = useLocation();

  // Define restricted paths for clients
  const restrictedPaths = ['/OffrePageDetails/:id', '/collabPage', '/collabPage/:id', '/mesReservations','offrePage'];

  // Check if the current path is one of the restricted paths
  const isRestricted = restrictedPaths.some(path => 
    location.pathname.includes(path.replace('/:id', '')) || location.pathname === path
  );

  // Redirect if user type is 'client' and they are trying to access a restricted path
  return userType === 'client' && isRestricted ? <Navigate to="/" /> : children;
};

export default ClientRestrictedRoute;
