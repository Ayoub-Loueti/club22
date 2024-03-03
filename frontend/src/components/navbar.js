import React from 'react';
import '../assets/navbar.css';
import logo from '../assets/ooredoo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUserGroup,
  faCalendar,
  faUser,
  faBell,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const handleSearch = (e) => {
    e.preventDefault();
    const searchText = e.target.elements.search.value; // Accès à la valeur du champ de recherche
    console.log('Recherche pour:', searchText);
    // Ici, vous pouvez ajouter la logique pour effectuer la recherche
  };

  return (
    <>
      <div className="navbar-horizontal">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            name="search"
            placeholder="Recherche..."
            id="search-input-navbar" // Identifiant unique pour le champ de recherche
            className="search-input"
          />
          <button type="submit" className="search-iconn">
            {/* Utilisation de l'icône de recherche */}
            <FontAwesomeIcon icon={faSearch} />
          </button>{' '}
        </form>
        <div className="icon-containerr">
          {/* Remplacez les icônes existantes par celles de FontAwesome */}
          <FontAwesomeIcon icon={faBell} className="navbar-iconn" />
          <FontAwesomeIcon icon={faUser} className="navbar-iconn" />
        </div>
      </div>
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
    </>
  );
}

export default Navbar;
