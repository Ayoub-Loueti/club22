import React , { useState }  from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true,
      });
      localStorage.removeItem('login');
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
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
