import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assurez-vous d'importer axios
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

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const DropdownMenu = () => (
    <div className="dropdown-menu">
      <a href="/profil">Profil</a>
      <a href="/settings">Paramètres</a>
      <a href="/logout">Déconnexion</a>
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
            {showDropdown && <DropdownMenu />}
          </>
        ) : (
          <>
            <FontAwesomeIcon
              icon={faUserCircle}
              className="navbar-iconn"
              onClick={toggleDropdown}
            />
            {showDropdown && <DropdownMenu />}
          </>
        )}
      </div>
    </div>
  );
}

export default NavbarHaut;
