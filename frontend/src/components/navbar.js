import React from 'react';
import '../assets/navbar.css';
import logo from '../assets/ooredoo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faCalendar,
  faUser,

} from '@fortawesome/free-solid-svg-icons';

function Navbar() {


  return (
  
      <nav className="navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <div className="icon-containerrr">
          <FontAwesomeIcon icon={faHouse} className="navbar-iconnn" />
          <FontAwesomeIcon icon={faUserGroup} className="navbar-iconnn" />
          <FontAwesomeIcon icon={faCalendar} className="navbar-iconnn" />
        </div>
        <div className="navbar-inner">
          <FontAwesomeIcon icon={faUser} className="inner-user" />
        </div>
        <div className="navbar-extension">
          {/* Contenu optionnel de l'extension, si nécessaire */}
        </div>
      </nav>

  );
}

export default Navbar;
