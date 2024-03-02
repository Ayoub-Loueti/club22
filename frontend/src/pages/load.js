import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Load() {
  const navigate = useNavigate();

  useEffect(() => {
    const authCompleted = JSON.parse(localStorage.getItem('login'))?.isAuthenticated;
    
    if (authCompleted) {
      navigate('/profil');
      return;
    }
  
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      localStorage.setItem('login', JSON.stringify({
        isAuthenticated: true,
        token: token,
      }));
      navigate('/profil'); 
    } else {
      navigate('/'); 
    }
  }, [navigate]);
  

  return <div>Loading...</div>;
}

export default Load;
