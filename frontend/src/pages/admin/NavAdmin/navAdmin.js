import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navAdmin.css';
import logo from '../../../assets/ooredoo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faCalendar,
  faUser,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

function NavAdmin() {
  const [isVisible, setIsVisible] = useState(false);
  const [randomUsers, setRandomUsers] = useState([]);
  const [navbarExtensionColor, setNavbarExtensionColor] = useState('#f3f3f3'); // Default color

  const navigate = useNavigate();
  // Current user's ID for navigation to the profile page
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Assuming the user ID is stored in localStorage under 'userId' after login
    const storedUserId = JSON.parse(localStorage.getItem('userId'));
    setCurrentUserId(storedUserId);
  }, []);

  useEffect(() => {
    const currentPage = window.location.pathname;
    if (currentPage.toLowerCase() === '/home') {
      setNavbarExtensionColor('#f3f3f3');
    } else {
      setNavbarExtensionColor('white');
    }
  }, []);

  const toggleNavbar = () => {
    setIsVisible(!isVisible);
  };



  return (
    <div>
      <div className="adm-navbar-toggle" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={faBars} style={{ fontSize: '27px' }} />
      </div>

      <nav className={`adm-navbar ${isVisible ? 'adm-visible' : ''}`}>
        <img src={logo} alt="Logo" className="adm-navbar-logo" />

        <div className="adm-navbar-links">
          <span
            className="adm-navbar-link"
            onClick={() => navigate('/tousLesUtilisateurs')}
          >
            Utilisateurs
          </span>
          <span
            className="adm-navbar-link"
            onClick={() => navigate('/ListCollab')}
          >
            collaborateurs
          </span>
          <span
            className="adm-navbar-link"
            onClick={() => navigate('/ListCollaborateur')}
          >
            Details collaborateurs
          </span>
          {/* Ajoutez ici d'autres liens vers vos pages */}
        </div>
      </nav>
    </div>
  );
}

export default NavAdmin;
