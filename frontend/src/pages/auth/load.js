import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function Load() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userId = params.get('userId');
        console.log('Token:', token);
        console.log('UserId:', userId);
        if (token && userId) {
          localStorage.setItem('login', JSON.stringify({ isAuthenticated: true, token }));
          localStorage.setItem('userId', JSON.stringify(userId)); // Save userId to localStorage
          setLoading(false);
          navigate(`/profil/${userId}`); // Redirect to the profile page
        } else {
          setLoading(false);
          MySwal.fire('Error', 'Token or userId not found.', 'error');
        }
      } catch (error) {
        setLoading(false);
        MySwal.fire('Error', 'An error occurred.', 'error');
      }
    };

    fetchData();
  }, [location.search, navigate, MySwal]);

  return (
    <div>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default Load;
