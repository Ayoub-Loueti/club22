import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faSearch,
  faUserCircle,
  faComment,
  faHeart,
  faHome,
  faUser,
  faSignOutAlt,
  faTimes,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import '../navbar/navbar.css';
import PostModal from '../postModal/postModal';
import PhoneNumberModal from '../PhoneNumberModal/PhoneNumberModal';

function NavbarHaut() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(null); // Add this line
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const menuRef = useRef();
  const notificationsRef = useRef();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userPoints, setUserPoints] = useState(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false); // State to control the phone modal visibility

  // This function toggles the notification dropdown
  const handleBellClick = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Only fetch notifications and reset count if notifications are not currently shown
      await fetchNotifications();
      await resetNotificationsCount();
    }
  };

  const handleSearchChange = async (e) => {
    const inputValue = e.target.value;
    setSearchInput(inputValue);
  
    if (inputValue.length > 0) {
      fetchUsersBySubstring(inputValue);
    } else {
      setSearchResults([]); // Clear results if input is cleared
    }
  };

  const fetchUsersBySubstring = async (substring) => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      const response = await axios.get(`http://localhost:5000/search?substring=${substring}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching users by substring', error);
    }
  };

  const resetNotificationsCount = async () => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      await axios.post(
        'http://localhost:5000/reset-notifications',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotificationsCount(0); // Reset the notifications count in the frontend as well
    } catch (error) {
      console.error(
        'Erreur lors de la réinitialisation du nombre de notifications',
        error
      );
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
      console.error('Erreur lors de la récupération des notifications', error);
    }
  };
  const handleNotificationClick = (notification) => {
    console.log(notification); // For debugging
    setSelectedPostId(notification.post.id_post); // Use notification.post.id_post
    setIsPostModalOpen(true);
    setShowNotifications(false); // Close the notifications dropdown
    markAsRead(notification.id_notif, notification.isRead); // Mark as read, assuming this function exists and works correctly
  };

  const NotificationsDropdown = () => (
    <div className="notifications-dropdown" ref={notificationsRef}>
      {notifications.length ? (
        notifications.map((notification) => (
          <div
            key={notification.id_notif}
            className={`notification-item ${
              !notification.isRead ? 'unseen' : ''
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <img
              src={`http://localhost:5000/${notification.utilisateur.photo}`}
              alt="User"
              className="notification-user-photo"
            />
            {/* Ici, on ajoute une condition pour afficher l'icône appropriée */}
            {notification.type === 'comment' ? (
              <FontAwesomeIcon
                icon={faComment}
                className="notification-icon-Comment"
              /> // Assurez-vous d'avoir importé faComment
            ) : (
              <FontAwesomeIcon
                icon={faHeart}
                className="notification-icon-jaime"
              /> // Assurez-vous d'avoir importé faHeart
            )}
            <div className="notification-text">
              <strong>
                {notification.utilisateur.prenom} {notification.utilisateur.nom}
              </strong>
              <span>
                {' '}
                {notification.notifier }{' '}
              </span>
            </div>
            <div
              className="notification-delete-icon"
              onClick={(e) => {
                e.stopPropagation(); // Prevent notification item click
                handleDeleteNotification(notification.id_notif);
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        ))
      ) : (
        <div className="notification-item">Pas de notifications</div>
      )}
    </div>
  );

  const markAsRead = async (notificationId, isRead) => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      await axios.patch(
        `http://localhost:5000/notifications/${notificationId}`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the notification state to reflect changes
      setNotifications(
        notifications.map((notification) => {
          if (notification.id_notif === notificationId) {
            return { ...notification, isRead: true };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error('Error marking notification as read', error);
    }
  };

  const fetchNotificationsCount = async () => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      const response = await axios.get(
        'http://localhost:5000/user-notifications',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotificationsCount(response.data.nbr_notifs);
    } catch (error) {
      console.error(
        'Erreur lors de la récupération du nombre de notifications',
        error
      );
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
  useEffect(() => {
    function handleClickOutside(event) {
      // Fermeture du menu utilisateur
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowDropdown(false);
      }

      // Fermeture du menu des notifications
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }

    // Ajoute l'écouteur lors du montage
    document.addEventListener('mousedown', handleClickOutside);

    // Retire l'écouteur lors du démontage
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef, notificationsRef]); // Exécute à nouveau si les références changent

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Now, 'userId' is available here because it's part of the component's state
  const UserInfo = () => (
    <div className="user-info" ref={menuRef}>
      {userInfo && (
        <>
          <div className="user-actions">
            <Link to={`/Home`} className="dropdown-item">
              <FontAwesomeIcon icon={faHome} className="acceuil-icon" />
              Acceuil
            </Link>
            <Link to={`/profil/${userId}`} className="dropdown-item">
              <FontAwesomeIcon icon={faUser} className="profil-icon" />
              Profil
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
const handleDeleteNotification = async (notificationId) => {
  const token = JSON.parse(localStorage.getItem('login')).token;
  try {
    // Remplacez cette URL par celle de votre API pour la suppression de notifications
    await axios.delete(
      `http://localhost:5000/notifications/${notificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Filtrez la notification supprimée de l'état
    setNotifications(
      notifications.filter(
        (notification) => notification.id_notif !== notificationId
      )
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification', error);
  }
};

useEffect(() => {
  const fetchUserPoints = async () => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      const response = await axios.get('http://localhost:5000/points', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserPoints(response.data.points); // Set user points in state
    } catch (error) {
      console.error('Error fetching user points', error);
    }
  };

  fetchUserPoints();
}, []);

const openPhoneModal = () => {
  setIsPhoneModalOpen(true);
};

const closePhoneModal = () => {
  setIsPhoneModalOpen(false);
};

  return (
    <div className="navbar-horizontal">
      <form className="searchh-formm" onSubmit={(e) => e.preventDefault()}>
  <input
    type="text"
    name="search"
    placeholder="Recherche..."
    id="search-input-navbar"
    className="searchh-inputt"
    value={searchInput}
    onChange={handleSearchChange}
  />
  <button type="submit" className="search-iconn">
    <FontAwesomeIcon icon={faSearch} />
  </button>
</form>
{searchResults.length > 0 ? (
  <div className="search-results">
    {searchResults.map((user) => (
      <Link to={`/profil/${user.id_utilisateur}`} key={user.id_utilisateur} className="search-result-item" style={{ textDecoration: 'none' }}>
        <img 
          src={user.photo ? `http://localhost:5000/${user.photo}` : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'} 
          alt={user.nom} 
          className="user-photooo" 
        />
        <div>
          {user.prenom} {user.nom}
        </div>
      </Link>
    ))}
  </div>
): (
  searchInput && <div className="search-results search-no-results-message">Il n'y a aucun utilisateur correspondant à votre recherche.</div>
)}
 {userInfo && userInfo.type === 'client' && (
      <FontAwesomeIcon
        icon={faPhone}
        className="navbar-icon"
        onClick={openPhoneModal}
      />
    )}
{userPoints !== null && userInfo && userInfo.type === 'client' && (
          <span className="points">{userPoints} points</span>
        )}
      <div className="icon-containerr">
        <FontAwesomeIcon
          icon={faBell}
          className="navbar-iconn"
          onClick={handleBellClick}
        />
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
            <PostModal
              isOpen={isPostModalOpen}
              onRequestClose={() => setIsPostModalOpen(false)}
              postId={selectedPostId}
            />
            <PhoneNumberModal
        isOpen={isPhoneModalOpen}
        onRequestClose={closePhoneModal}
      />
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
