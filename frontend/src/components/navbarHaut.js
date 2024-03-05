import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faSearch,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import '../assets/navbar.css';

function NavbarHaut() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:5000/profil', {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          });
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
      localStorage.removeItem('login'); // Supprimez le token stocké pour la déconnexion
      await axios.get('http://localhost:5000/auth/logout', {
        withCredentials: true,
      });
      navigate('/'); 
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Alternative au menu déroulant
 const UserInfo = () => (
   <div className="user-info">
     {userInfo && (
       <>
         <div className="user-actions">
           <a href="/profil">Profil</a>
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
