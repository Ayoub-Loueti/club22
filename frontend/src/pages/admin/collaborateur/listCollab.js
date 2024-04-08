// ListCollaborateur.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListCollab.css';
import UpdateCollaborateurModal from './UpdateCollaborateurModal';
import AddCollaborateurModal from './AddCollaborateurModal';
import OffreCollab from '../offre/OffreCollab'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { FaArrowLeft } from 'react-icons/fa';

function ListCollaborateur() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaboratorAddedOrUpdated, setCollaboratorAddedOrUpdated] =
    useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchCollaborateurs = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/allCollaborators',
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setCollaborateurs(response.data);
      } catch (error) {
        console.error('Error fetching collaborateurs:', error);
      }
    };

    if (token) {
      fetchCollaborateurs();
    }
  }, [token, collaboratorAddedOrUpdated]);

  const handleUpdate = (collaborateurId) => {
    setSelectedCollaborateurId(collaborateurId);
    setIsUpdateModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddOrUpdateSuccess = () => {
    setCollaboratorAddedOrUpdated((prev) => !prev);
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

const handleNext = () => {
  // La taille de page est le nombre de collaborateurs que vous souhaitez afficher à la fois.
  const pageSize = 3;
  // Calculer le nombre total de pages.
  const totalPages = Math.ceil(collaborateurs.length / pageSize);
  // Calculer la page actuelle basée sur startIndex.
  const currentPage = Math.ceil((startIndex + 1) / pageSize);
  // S'assurer qu'on ne dépasse pas le nombre total de pages.
  if (currentPage < totalPages) {
    setStartIndex(startIndex + pageSize);
  }
};


 const filteredCollaborateurs = collaborateurs.filter((collaborateur) => {
   const nom = collaborateur.nom ? collaborateur.nom.toLowerCase() : ''; // Check if nom is not null
   const type = collaborateur.type ? collaborateur.type.toLowerCase() : ''; // Check if type is not null
   const adresse = collaborateur.adresse
     ? collaborateur.adresse.toLowerCase()
     : ''; // Check if adresse is not null
   const tel = collaborateur.tel ? collaborateur.tel.toLowerCase() : ''; // Check if tel is not null
   const email = collaborateur.email ? collaborateur.email.toLowerCase() : ''; // Check if email is not null
   const siteWeb = collaborateur.siteWeb
     ? collaborateur.siteWeb.toLowerCase()
     : ''; // Check if siteWeb is not null

   return (
     nom.includes(searchTerm.toLowerCase()) ||
     type.includes(searchTerm.toLowerCase()) ||
     adresse.includes(searchTerm.toLowerCase()) ||
     tel.includes(searchTerm.toLowerCase()) ||
     email.includes(searchTerm.toLowerCase()) ||
     siteWeb.includes(searchTerm.toLowerCase())
   );
 });
    const scrollToRef = React.createRef();

const handleViewOffers = () => {
  // Assurez-vous que la référence existe et est actuellement montée dans le DOM
  if (scrollToRef.current) {
    // Fait défiler vers l'élément référencé
    window.scrollTo({
      top: scrollToRef.current.offsetTop, // Position Y de l'élément
      behavior: 'smooth', // Option pour un défilement doux
    });
  }
};

  return (
    <div className="listCollaborateur-container">
      <button className="retour-btn" onClick={() => window.history.back()}>
        <FaArrowLeft /> Retour
      </button>
      <h1 className="listCollaborateur-title">LISTE DES COLLABORATEURS</h1>

      <button onClick={handleOpenModal} className="list-coll-button">
        AJOUTER UN COLLABORATEUR
      </button>
      <button
        className="list-coll-button"
        onClick={() => navigate('/listCollaborateur')}
      >
        VOIR TOUS LES COLLABORATEURS
      </button>
      <button
        onClick={() => navigate('/offreAdmin')}
        className="list-coll-button"
      >
        GERER LES OFFRES
      </button>
      <AddCollaborateurModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSuccess={handleAddOrUpdateSuccess}
      />
      <div className="listCollaborateur-header">
        <input
          type="text"
          className="listCollaborateur-search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="cards-and-navigation">
        <button
          className="prev"
          onClick={handlePrevious}
          disabled={startIndex === 0}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>

        <div className="collaborateur-scroll-container">
          {filteredCollaborateurs
            .slice(startIndex, startIndex + 3)
            .map((collaborateur, index) => (
              <div key={index} className="collaborateur-card">
                <img
                  src={
                    collaborateur.logo
                      ? `http://localhost:5000/${collaborateur.logo}`
                      : 'https://png.pngtree.com/png-vector/20220119/ourmid/pngtree-crossed-image-icon-picture-not-available-sign-photo-sign-icon-vector-png-image_44027862.jpg'
                  }
                  alt={collaborateur.nom}
                />

                <h3 className="collaborateur-card-title">
                  {collaborateur.nom}
                </h3>
                <p className="collaborateur-card-description">
                  Catégorie :{' '}
                  <span className="description-value">
                    {collaborateur.type}
                  </span>
                </p>
                <p className="collaborateur-card-description">
                  Adresse :{' '}
                  <span className="description-value">
                    {collaborateur.adresse}
                  </span>
                </p>
                <p className="collaborateur-card-description">
                  Télephone :{' '}
                  <span className="description-value">{collaborateur.tel}</span>
                </p>
                <p className="collaborateur-card-description">
                  Email :{' '}
                  <span className="description-value">
                    {collaborateur.email}
                  </span>
                </p>
                <p className="collaborateur-card-description">
                  Site Web :{' '}
                  <span className="description-value">
                    {collaborateur.siteWeb &&
                    collaborateur.siteWeb.trim() !== ''
                      ? collaborateur.siteWeb
                      : 'non disponible'}
                  </span>
                </p>

                <button
                  onClick={() => handleUpdate(collaborateur.id_collaborateur)}
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setSelectedCollaborateurId(collaborateur.id_collaborateur);
                    handleViewOffers(); // Déclenche le défilement après la mise à jour de l'état
                  }}
                  className="offers"
                >
                  Voir ses Offres
                </button>
              </div>
            ))}
        </div>
        <button
          className="next"
          onClick={handleNext}
          disabled={startIndex + 3 >= collaborateurs.length}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <UpdateCollaborateurModal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleAddOrUpdateSuccess}
        collaborateurId={selectedCollaborateurId}
      />
      <div className="stylish-separator"></div>
      {selectedCollaborateurId && (
        <div ref={scrollToRef}>
          <OffreCollab collaborateurId={selectedCollaborateurId} />
        </div>
      )}
    </div>
  );
}

export default ListCollaborateur;
