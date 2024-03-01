import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Load() {
  const navigate = useNavigate();

  useEffect(() => {
    const authCompleted = localStorage.getItem('authCompleted');
    
    if (authCompleted) {
      // If authentication was already completed, navigate to profile directly
      navigate('/profile');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('token', token); // Save token to local storage
      localStorage.setItem('authCompleted', 'true'); // Set authentication completed flag
      navigate('/profile'); // Redirect to the profile or any other page
    } else {
      navigate('/'); // If no token found, redirect back to login
    }
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Load;
