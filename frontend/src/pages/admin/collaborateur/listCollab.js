// ListCollaborateur.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListCollab.css';
import UpdateCollaborateurModal from './UpdateCollaborateurModal';
import AddCollaborateurModal from './AddCollaborateurModal';
import OffreCollab from '../offre/OffreCollab'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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
          'http://localhost:5000/allCollaborateursAD',
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
  }, [collaboratorAddedOrUpdated, token]);

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
    if (startIndex + 4 < collaborateurs.length) {
      setStartIndex(startIndex + 1);
    }
  };
  const filteredCollaborateurs = collaborateurs.filter((collaborateur) =>
    collaborateur.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );
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
                  src={`http://localhost:5000/${collaborateur.logo}`}
                  alt={collaborateur.nom}
                />
                <h3 className="collaborateur-card-title">
                  {collaborateur.nom}
                </h3>
                <p className="collaborateur-card-description">
                  Catégorie : {collaborateur.type}
                </p>
                <p className="collaborateur-card-description">
                  Adresse : {collaborateur.adresse}
                </p>
                <p className="collaborateur-card-description">
                  Télephone : {collaborateur.tel}
                </p>
                <p className="collaborateur-card-description">
                  Email : {collaborateur.email}
                </p>
                <p className="collaborateur-card-description">
                  Site Web : {collaborateur.siteWeb}
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
          disabled={startIndex + 4 >= collaborateurs.length}
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
