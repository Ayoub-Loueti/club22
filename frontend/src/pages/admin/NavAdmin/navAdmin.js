import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navAdmin.css';
import logo from '../../../assets/ooredooWhite.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faCalendar,
  faUser,
  faBars,
  faUserPlus, 
  faList,
  faUserCircle,
  faUserAlt,
  faUserAltSlash,
  faUserAstronaut,
  faUserFriends,
  faUsersViewfinder,
  faUserCog,
  faUserShield,
  faUsersRectangle,
} from '@fortawesome/free-solid-svg-icons';

function NavAdmin() {
  const [isVisible, setIsVisible] = useState(false); // Set default to true to mirror the second navbar
  const [randomUsers, setRandomUsers] = useState([]);
  const [navbarExtensionColor, setNavbarExtensionColor] = useState('#f3f3f3');
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const storedUserId = JSON.parse(localStorage.getItem('userId'));
    setCurrentUserId(storedUserId);
  }, []);

  useEffect(() => {
    const currentPage = window.location.pathname;
    setNavbarExtensionColor(
      currentPage.toLowerCase() === '/home' ? '#f3f3f3' : 'white'
    );
  }, []);

  useEffect(() => {
    const fetchRandomUsers = async () => {
      const storedToken = localStorage.getItem('login')
        ? JSON.parse(localStorage.getItem('login')).token
        : null;
      const headers = storedToken
        ? { Authorization: `Bearer ${storedToken}` }
        : {};
      try {
        const response = await axios.get('http://localhost:5000/randomUsers', {
          headers,
        });
        setRandomUsers(response.data);
      } catch (error) {
        console.error('Error fetching random users:', error);
      }
    };
    fetchRandomUsers();
  }, []);

  const toggleNavbar = () => {
    setIsVisible(!isVisible);
    
  };

    const icons = [
      { icon: faHouse, label: 'Accueil', path: '/Home' },
      {
        icon: faUserGroup,
        label: 'Utilisateurs',
        path: `/tousLesUtilisateurs`,
      },
      { icon: faCalendar, label: 'Offres', path: '/OffreAdmin' },
      { icon: faUserPlus, label: 'Collaborateurs', path: '/listCollab' },
      {
        icon: faList,
        label: 'Details Collaborateurs',
        path: '/listCollaborateur',
      },
      {
        icon: faUsersRectangle,
        label: 'Demandes Adhésion',
        path: '/adminAdherant',
      },
    ];

    const handleMouseEnter = () => {
      setExpanded(true);
    };

    const handleMouseLeave = () => {
      setExpanded(false);
    };

  return (
    <div>
      <div className="adm-navbar-toggle" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={faBars} style={{ fontSize: '27px' }} />
      </div>

      <nav
        className={`adm-navbar ${isVisible ? 'adm-visible' : ''} ${
          expanded ? 'expanded' : ''
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src={logo} alt="Logo" className="adm-navbar-logo" />
        <div className="adm-icon-container">
          {icons.map((item, index) => (
            <div
              key={index}
              className="adm-icon-wrapper"
              onClick={() => navigate(item.path)}
            >
              <div className="icon-and-tooltip">
                <FontAwesomeIcon icon={item.icon} className="adm-navbar-icon" />
                <span className="adm-tooltip">{item.label}</span>
              </div>
            </div>
          ))}
        </div>


       
      </nav>
    </div>
  );
}

export default NavAdmin;
