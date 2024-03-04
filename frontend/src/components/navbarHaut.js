import React from 'react';
import '../assets/navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {

  faUser,
  faBell,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

function NavbarHaut() {

  return (
   
      <div className="navbar-horizontal">
        <form  className="searchh-formm">
          <input
            type="text"
            name="search"
            placeholder="Recherche..."
            id="search-input-navbar" 
            className="searchh-inputt"
          />
          <button type="submit" className="search-iconn">
            <FontAwesomeIcon icon={faSearch} />
          </button>{' '}
        </form>
        <div className="icon-containerr">
          <FontAwesomeIcon icon={faBell} className="navbar-iconn" />
          <FontAwesomeIcon icon={faUser} className="navbar-iconn" />
        </div>
      </div>
      
    
  );
}

export default NavbarHaut;
