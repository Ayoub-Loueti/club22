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
  faBars,
  faUserPlus,
  faList,
  faUserShield,
  faUsersRectangle,
  faCalendarAlt,
  faRectangleList,
  faDashboard,
  faFileCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';

function NavAdmin() {
  const [isVisible, setIsVisible] = useState(false);
  const [randomUsers, setRandomUsers] = useState([]);
  const [navbarExtensionColor, setNavbarExtensionColor] = useState('#f3f3f3');
  const navigate = useNavigate();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [signalsCount, setSignalsCount] = useState(0);

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
        const response = await axios.get('http://54.242.240.123/randomUsers', {
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

  useEffect(() => {
    const fetchSignalsCount = async () => {
      const storedToken = localStorage.getItem('login')
        ? JSON.parse(localStorage.getItem('login')).token
        : null;
      if (storedToken) {
        const headers = { Authorization: `Bearer ${storedToken}` };
        try {
          const response = await axios.get(
            'http://54.242.240.123/signalsCount',
            {
              headers,
            }
          );
          setSignalsCount(response.data.count);
        } catch (error) {
          console.error('Error fetching signals count:', error);
        }
      }
    };

    fetchSignalsCount();
  }, []);

  const updateAllSignalsToOpen = async () => {
    const storedToken = localStorage.getItem('login')
      ? JSON.parse(localStorage.getItem('login')).token
      : null;
    if (!storedToken) {
      console.error('No token found, user might not be authenticated');
      return;
    }
    const headers = { Authorization: `Bearer ${storedToken}` };

    try {
      const response = await axios.patch(
        'http://54.242.240.123/updateAllSignalerOpen',
        {},
        { headers }
      );
      if (response.status === 200) {
        console.log('All signals have been updated to open');
        // Optionally perform any state updates or call other functions to reflect changes
      }
    } catch (error) {
      console.error('Error updating signals to open:', error);
    }
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
    {
      icon: faUserShield,
      label: signalsCount > 0 ? `Signaler (${signalsCount})` : 'Signalements',
      path: '/adminSignal',
    },
    {
      icon: faRectangleList,
      label: 'liste réservations',
      path: '/listReservation',
    },
    {
      icon: faCalendarAlt,
      label: 'Demandes réservations',
      path: '/demandeReservation',
    },
    {
      icon: faDashboard,
      label: 'Dashboard',
      path: '/dashboard',
    },
    {
      icon: faFileCircleExclamation,
      label: 'Réclamations',
      path: '/ReclamationsAdmin',
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
              onClick={() => {
                if (item.label.includes('Signaler')) {
                  updateAllSignalsToOpen();
                }
                navigate(item.path);
              }}
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
