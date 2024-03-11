import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faSearch,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import '../navbar/navbar.css';

function NavbarHaut() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null); // Add this line
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId')); // Rename for clarity
    setUserId(storedUserId);

    if (token && storedUserId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/profil/${storedUserId}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          setUserInfo(response.data.user);
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            error
          );
        }
      };
      fetchUserData();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true,
      });
      localStorage.removeItem('login');
      localStorage.removeItem('userId');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Now, 'userId' is available here because it's part of the component's state
  const UserInfo = () => (
    <div className="user-info">
      {userInfo && (
        <>
          <div className="user-actions">
            <Link to={`/home`} className="dropdown-item">
              Acceuil
            </Link>
            <Link to={`/profil/${userId}`} className="dropdown-item">
              Profil
            </Link>

            <button onClick={handleLogout} className="logout-button">
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="navbar-horizontal">
      <form className="searchh-formm">
        <input
          type="text"
          name="search"
          placeholder="Recherche..."
          id="search-input-navbar"
          className="searchh-inputt"
        />
        <button type="submit" className="search-iconn">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
      <div className="icon-containerr">
        <FontAwesomeIcon icon={faBell} className="navbar-iconn" />
        {userInfo ? (
          <>
            <img
              src={
                userInfo.photo
                  ? `http://localhost:5000/${userInfo.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="Profil"
              className="navbar-iconn user-photo"
              onClick={toggleDropdown}
            />
            {showDropdown && <UserInfo />}
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faUserCircle}
              className="navbar-iconn"
              onClick={toggleDropdown}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default NavbarHaut;
