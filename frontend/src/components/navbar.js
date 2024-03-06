import React, { useState } from 'react';
import '../assets/navbar.css';
import logo from '../assets/ooredoo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faCalendar,
  faUser,
  faBars,
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
const [isVisible, setIsVisible] = useState(true);
  // Function to toggle visibility
const toggleNavbar = () => {
  setIsVisible(!isVisible);
};


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
        </div>

        <div className="navbar-extension"></div>
      </nav>
    </div>
  );
}

export default Navbar;
