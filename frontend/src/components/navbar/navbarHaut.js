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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);

  // This function toggles the notification dropdown
  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) { // Only fetch notifications and reset count if notifications are not currently shown
      await fetchNotifications();
      await resetNotificationsCount();
    }
  };
  
  const resetNotificationsCount = async () => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      await axios.post('http://localhost:5000/reset-notifications', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationsCount(0); // Reset the notifications count in the frontend as well
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du nombre de notifications", error);
    }
  };

  const fetchNotifications = async () => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      const response = await axios.get('http://localhost:5000/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications", error);
    }
  };

  const NotificationsDropdown = () => (
    <div className="notifications-dropdown">
      {notifications.length ? (
        notifications.map((notification) => (
          <div
            key={notification.id_notif}
            className={`notification-item ${!notification.isRead ? "unseen" : ""}`}
            onClick={() => markAsRead(notification.id_notif, notification.isRead)}
          >
            <img src={`http://localhost:5000/${notification.utilisateur.photo}`} alt="User" className="notification-user-photo"/>
            <div className="notification-text">
              <strong>{notification.utilisateur.nom} {notification.utilisateur.prenom}</strong>
              <span>
                {notification.type === 'comment' ? ' a commenté votre publication' : ' a aimé votre publication'}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="notification-item">Pas de notifications</div>
      )}
    </div>
  );
  
  
  const markAsRead = async (notificationId, isRead) => {
    if (!isRead) {
      const token = JSON.parse(localStorage.getItem('login')).token;
      try {
        await axios.patch(`http://localhost:5000/notifications/${notificationId}`, { isRead: true }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Update the notification state to reflect changes
        setNotifications(notifications.map(notification => {
          if (notification.id_notif === notificationId) {
            return { ...notification, isRead: true };
          }
          return notification;
        }));
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la notification", error);
      }
    }
  };
  
  const fetchNotificationsCount = async () => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      const response = await axios.get('http://localhost:5000/user-notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotificationsCount(response.data.nbr_notifs);
    } catch (error) {
      console.error("Erreur lors de la récupération du nombre de notifications", error);
    }
  };
  
  useEffect(() => {
    fetchNotificationsCount();
  }, []); // The empty array ensures this effect runs once on mount
  
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
            <Link to={`/Home`} className="dropdown-item">
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
      <FontAwesomeIcon icon={faBell} className="navbar-icon" onClick={handleBellClick} />
  {notificationsCount > 0 && (
    <span className="notifications-count">{notificationsCount}</span>
  )}
  {showNotifications && <NotificationsDropdown />}
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
