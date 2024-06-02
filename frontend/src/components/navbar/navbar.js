import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navbar.css';
import logo from '../../assets/ooredoo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faCalendar,
  faUser,
  faBars,
  faClipboardList,
  faHouseUser,
  faFileCircleExclamation,
  faCommentSlash,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import AdherantModal from '../AdherantModal/AdherantModal';

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [randomUsers, setRandomUsers] = useState([]);
  const [navbarExtensionColor, setNavbarExtensionColor] = useState('#f3f3f3'); // Default color
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdherent, setIsAdherent] = useState(false);
  const [isAdherantModalOpen, setIsAdherantModalOpen] = useState(false);

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

  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const storedToken = localStorage.getItem('login')
          ? JSON.parse(localStorage.getItem('login')).token
          : null;
        const headers = storedToken
          ? { Authorization: `Bearer ${storedToken}` }
          : {};
        const response = await axios.get('http://3.88.157.0/randomUsers', {
          headers,
        });
        setRandomUsers(response.data);
      } catch (error) {
        console.error('Error fetching random users:', error);
      }
    };
    fetchRandomUsers();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId')); // Rename for clarity
    setUserId(storedUserId);

    if (token && storedUserId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://3.88.157.0/profil/${storedUserId}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          setUserInfo(response.data.user);
          checkAdherentStatus(storedUserId, JSON.parse(token).token);
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

  const checkAdherentStatus = async (userId, token) => {
    try {
      const response = await axios.get('http://3.88.157.0/isAdherant', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.adherant);
      setIsAdherent(response.data.adherant);
      console.log(isAdherent);
    } catch (error) {
      console.error('Error checking adherent status:', error);
    }
  };

  return (
    <div>
      <div className="navbar-toggle" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={faBars} style={{ fontSize: '27px' }} />
      </div>

      <nav className={`navbar ${!isVisible ? 'visible' : ''}`}>
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="icon-containerrr">
          <FontAwesomeIcon
            icon={faHouse}
            className="navbar-iconnn"
            onClick={() => navigate('/Home')}
          />
          <FontAwesomeIcon
            icon={faUser}
            className="navbar-iconnn"
            onClick={() => navigate(`/profil/${currentUserId}`)}
          />
          {userInfo && userInfo.type === 'employe' && (
            <FontAwesomeIcon
              icon={faCalendar}
              className="navbar-iconnn"
              onClick={() => navigate('/collabPage')}
            />
          )}
          {userInfo && userInfo.type === 'employe' && (
            <FontAwesomeIcon
              icon={faClipboardList}
              className="navbar-iconnn"
              onClick={() => navigate('/mesReservations')}
            />
          )}
          {userInfo && userInfo.type === 'employe' && (
            <FontAwesomeIcon
              icon={faFileCircleExclamation}
              className="navbar-iconnn"
              onClick={() => navigate('/reclamation')}
            />
          )}

          {userInfo && userInfo.type === 'employe' && isAdherent && (
            <FontAwesomeIcon
              icon={faComment}
              className="navbar-iconnn"
              onClick={() => navigate('/message')}
            />
          )}
          {userInfo && userInfo.type === 'employe' && !isAdherent && (
            <>
              <FontAwesomeIcon
                icon={faCommentSlash}
                className="navbar-iconnn"
                onClick={() => setIsAdherantModalOpen(true)} // This line changes to open the modal
              />
              <AdherantModal
                isOpen={isAdherantModalOpen}
                onRequestClose={() => setIsAdherantModalOpen(false)}
                user={currentUserId}
              />
            </>
          )}
          {userInfo && userInfo.type === 'admin' && (
            <FontAwesomeIcon
              icon={faComment}
              className="navbar-iconnn"
              onClick={() => navigate('/message')}
            />
          )}
          {userInfo && userInfo.type === 'admin' && (
            <FontAwesomeIcon
              icon={faHouseUser}
              className="navbar-iconnn"
              onClick={() => navigate('/tousLesUtilisateurs')}
            />
          )}
        </div>

        <div className="navbar-inner">
          <FontAwesomeIcon icon={faUserGroup} className="inner-user" />
          {randomUsers.map((user, index) => (
            <img
              key={index}
              src={
                user.photo
                  ? `http://3.88.157.0/${user.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="User"
              className="user-photoo"
              onClick={() => navigate(`/profil/${user.id_utilisateur}`)}
            />
          ))}
        </div>

        <div
          className="navbar-extension"
          style={{ backgroundColor: navbarExtensionColor }}
        ></div>
      </nav>
    </div>
  );
}

export default Navbar;
