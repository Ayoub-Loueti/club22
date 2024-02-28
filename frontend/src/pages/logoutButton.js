import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Remove the token from localStorage
      localStorage.removeItem('token');

      // Optionally, send a request to the backend to invalidate the session or token
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true,
      });

      // After logging out, redirect the user to the login page or home page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle errors (e.g., show an error message)
    }
  };

  return (
    <button
      onClick={handleLogout}
      style={
        {
          /* Add any styling here */
        }
      }
    >
      Disconnect
    </button>
  );
}

export default LogoutButton;
