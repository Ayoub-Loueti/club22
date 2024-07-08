import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRestrictedRoute = ({ children }) => {
  const userType = JSON.parse(localStorage.getItem('userType')); // Get the user type from local storage
  const location = useLocation();

  // Define paths restricted to admin users
  const adminRestrictedPaths = ["/listClient","/listEmploye","/listCollaborateur","/listCollab","/adminAdherant","/adminSignal","/OffreAdmin","/listReservation","/tousLesUtilisateurs"];

  // Check if the current path is one of the restricted paths
  const isRestricted = adminRestrictedPaths.some(path => location.pathname.startsWith(path));

  // Redirect if user type is not 'admin' and they are trying to access a restricted path
  return userType === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRestrictedRoute;
