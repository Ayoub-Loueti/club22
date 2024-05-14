import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation  } from 'react-router-dom';
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
  faPhone,faCheckCircle, faTimesCircle, faExclamationCircle,
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
  const [searchResults, setSearchResults] = useState({
    users: [],
    offers: [],
    collaborators: [],
  });
  const [userPoints, setUserPoints] = useState(null);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false); // State to control the phone modal visibility
  const location = useLocation();
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
      fetchUsersAndOffersBySubstring(inputValue);
    } else {
      setSearchResults({ users: [], offers: [], collaborators: [] }); // Clear results if input is cleared
    }
  };

  const fetchUsersAndOffersBySubstring = async (substring) => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    try {
      const response = await axios.get(
        `http://localhost:5000/search?substring=${substring}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Set the search results safely by ensuring both `users` and `offers` exist in the response data
      setSearchResults({
        users: Array.isArray(response.data.users) ? response.data.users : [],
        offers: Array.isArray(response.data.offers) ? response.data.offers : [],
        collaborators: Array.isArray(response.data.collaborators)
          ? response.data.collaborators
          : [],
      });
    } catch (error) {
      console.error('Error fetching users and offers by substring', error);
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
    if (
      !['reservaccepte', 'signal', 'reservrefuse'].includes(notification.type)
    ) {
      console.log(notification); // For debugging
      setSelectedPostId(notification.post.id_post); // Use notification.post.id_post
      setIsPostModalOpen(true);
      setShowNotifications(false); // Close the notifications dropdown
      markAsRead(notification.id_notif, notification.isRead); // Mark as read, assuming this function exists and works correctly
    }
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
            {notification.type === 'reservaccepte' && (
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="notification-icon-Comment"
                style={{ color: '#73e24b' }}
              />
            )}
            {notification.type === 'reservrefuse' && (
              <FontAwesomeIcon
                icon={faTimesCircle}
                className="notification-icon-Comment"
                style={{ color: '#de1212' }}
              />
            )}
            {notification.type === 'signal' && (
              <FontAwesomeIcon
                icon={faExclamationCircle}
                className="notification-icon-Comment"
                style={{ color: '#ded712' }}
              />
            )}
            {['reservaccepte', 'reservrefuse', 'signal'].includes(
              notification.type
            ) ? (
              <div className="notification-text">
                <span>{notification.contenu}</span>
              </div>
            ) : (
              <>
                {notification.type === 'comment' ? (
                  <FontAwesomeIcon
                    icon={faComment}
                    className="notification-icon-Comment"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="notification-icon-jaime"
                  />
                )}
                <div className="notification-text">
                  <strong>
                    {notification.utilisateur.prenom}{' '}
                    {notification.utilisateur.nom}
                  </strong>
                  <span>{notification.notifier}</span>
                </div>
              </>
            )}
            <div
              className="notification-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
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
      localStorage.removeItem('userType');
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
}, [menuRef, notificationsRef]);
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Now, 'userId' is available here because it's part of the component's state
  const UserInfo = () => (
    <div className="user-info" ref={menuRef}>
      {userInfo && (
        <>
          <div className="user-actions">
            <Link to={`/Home`} className="dropdown-item">
              <FontAwesomeIcon icon={faHome} className="acceuil-icon" />
              <strong> Acceuil</strong>
            </Link>
            <Link to={`/profil/${userId}`} className="dropdown-item">
              <FontAwesomeIcon icon={faUser} className="profil-icon" />
              <strong> Profil</strong>
            </Link>
            <button onClick={handleLogout} className="logout-button">
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
              <strong>Déconnexion</strong>
            </button>
          </div>
        </>
      )}
    </div>
  );
  const handleDeleteNotification = async (notificationId) => {
    const token = JSON.parse(localStorage.getItem('login')).token;
    const notification = notifications.find(
      (n) => n.id_notif === notificationId
    );

    try {
      if (
        ['reservaccepte', 'signal', 'reservrefuse'].includes(notification.type)
      ) {
        await axios.delete(
          `http://localhost:5000/notificationsTroix/${notificationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.delete(
          `http://localhost:5000/notifications/${notificationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Filter out the deleted notification from the state
      setNotifications(
        notifications.filter((n) => n.id_notif !== notificationId)
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

  const isProfilePage = location.pathname.includes('/profil/');
  const isHomePage = location.pathname.includes('/Home');

  return (
    <div
      className={`navbar-horizontal ${
        isProfilePage || isHomePage ? '' : 'hide-search-bar'
      }`}
    >
      {!isProfilePage && !isHomePage && (
        <div>
          {' '}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      )}
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
      {searchResults.users.length > 0 ||
      searchResults.offers.length > 0 ||
      searchResults.collaborators.length > 0 ? (
        <div className="search-results">
          {searchResults.users.length > 0 && (
            <>
              <div className="search-results-title">Utilisateurs :</div>
              {searchResults.users.map((user) => (
                <Link
                  to={`/profil/${user.id_utilisateur}`}
                  key={user.id_utilisateur}
                  className="search-result-item"
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={
                      user.photo
                        ? `http://localhost:5000/${user.photo}`
                        : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
                    }
                    alt={user.nom}
                    className="user-photooo"
                  />
                  <div>
                    {user.prenom} {user.nom}
                  </div>
                </Link>
              ))}
            </>
          )}
          {userInfo &&
            userInfo.type === 'employe' &&
            searchResults.offers.length > 0 && (
              <>
                <div className="search-results-title">Offres :</div>
                {searchResults.offers.map((offer) => (
                  <div
                    key={offer.id_offre}
                    className="search-result-item"
                    onClick={() =>
                      navigate(`/OffrePageDetails/${offer.id_offre}`)
                    }
                  >
                    <img
                      src={`http://localhost:5000/${offer.images[0]}`}
                      alt="Offer"
                      className="user-photooo"
                    />
                    <div>{offer.titre}</div>
                  </div>
                ))}
              </>
            )}
          {userInfo &&
            userInfo.type === 'employe' &&
            searchResults.collaborators.length > 0 && (
              <>
                <div className="search-results-title">collaborateurs :</div>
                {searchResults.collaborators.map((collab) => (
                  <div
                    key={collab.id_collaborateur}
                    className="search-result-item"
                    onClick={() =>
                      navigate(`/collabPage/${collab.id_collaborateur}`)
                    }
                  >
                    <img
                      src={
                        collab.logo
                          ? `http://localhost:5000/${collab.logo}`
                          : 'default-image-path.jpg'
                      }
                      alt="Collab Logo"
                      className="user-photooo"
                    />
                    <div>{collab.nom}</div>
                  </div>
                ))}
              </>
            )}
        </div>
      ) : (
        searchInput && (
          <div className="search-results search-no-results-message">
            Aucun résultat trouvé pour votre recherche.{' '}
          </div>
        )
      )}

      {userInfo && userInfo.type === 'client' && (
        <FontAwesomeIcon
          icon={faPhone}
          className="phone-icon"
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
