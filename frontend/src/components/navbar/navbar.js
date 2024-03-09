import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './navbar.css';
import logo from '../../assets/ooredoo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserGroup, faCalendar, faUser, faBars } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [randomUsers, setRandomUsers] = useState([]);
  const navigate = useNavigate();

  // Function to toggle visibility
  const toggleNavbar = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    const fetchRandomUsers = async () => {
      try {
        const storedToken = localStorage.getItem('login') ? JSON.parse(localStorage.getItem('login')).token : null;
        const headers = storedToken ? { Authorization: `Bearer ${storedToken}` } : {};
        const response = await axios.get('http://localhost:5000/randomUsers', { headers });
        setRandomUsers(response.data);
      } catch (error) {
        console.error('Error fetching random users:', error);
        // Handle error: Redirect to login page or display an error message
      }
    };

    fetchRandomUsers();
  }, []);
  
  return (
    <div>
      <div className="navbar-toggle" onClick={toggleNavbar}>
        <FontAwesomeIcon icon={faBars} style={{ fontSize: '27px' }} />{' '}
      </div>

      <nav className={`navbar ${!isVisible ? '' : 'visible'}`}>
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="icon-containerrr">
          <FontAwesomeIcon icon={faHouse} className="navbar-iconnn" />
          <FontAwesomeIcon icon={faUserGroup} className="navbar-iconnn" />
          <FontAwesomeIcon icon={faCalendar} className="navbar-iconnn" />
        </div>

        <div className="navbar-inner">
          <FontAwesomeIcon icon={faUser} className="inner-user" />
          {randomUsers.map((user, index) => (
            <img
              key={index}
              src={user.photo ? `http://localhost:5000/${user.photo}` : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'}
              alt="User"
              className="user-photo"
              onClick={() => navigate(`/profil/${user.id_utilisateur}`)}
            />
          ))}
        </div>


        <div className="navbar-extension"></div>
      </nav>
    </div>
  );
}

export default Navbar;
