// ListCollaborateur.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ListCollab.css';
import UpdateCollaborateurModal from './UpdateCollaborateurModal';
import AddCollaborateurModal from './AddCollaborateurModal';
import OffreCollab from '../offre/OffreCollab'; // Ensure this path is correct
import { useNavigate } from 'react-router-dom';

function ListCollaborateur() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaboratorAddedOrUpdated, setCollaboratorAddedOrUpdated] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchCollaborateurs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allCollaborateursAD', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
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

  return (
    <div className="listCollaborateur-container">
      <button onClick={handleOpenModal} className="list-collab-button">
        Ajouter Collaborateur
      </button>
      <button className="voir-tous-button" onClick={() => navigate('/listCollaborateur')}>
        Voirs tous
      </button>
      <AddCollaborateurModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSuccess={handleAddOrUpdateSuccess}
      />
      <div className="listCollaborateur-header">
        <h1 className="listCollaborateur-title">LISTE DES COLLABORATEURS</h1>
        <input
          type="text"
          className="listCollaborateur-search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="collaborateur-scroll-container">
        {collaborateurs.slice(startIndex, startIndex + 4).map((collaborateur, index) => (
          <div key={index} className="collaborateur-card">
            <img src={`http://localhost:5000/${collaborateur.logo}`} alt={collaborateur.nom} />
            <h3 className="collaborateur-card-title">{collaborateur.nom}</h3>
            <p className="collaborateur-card-description">{collaborateur.type}</p>
            <button onClick={() => handleUpdate(collaborateur.id_collaborateur)}>Modifier</button>
            <button onClick={() => setSelectedCollaborateurId(collaborateur.id_collaborateur)}>Show Offres</button>
          </div>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handlePrevious} disabled={startIndex === 0}>Previous</button>
        <button onClick={handleNext} disabled={startIndex + 4 >= collaborateurs.length}>Next</button>
      </div>
      <UpdateCollaborateurModal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleAddOrUpdateSuccess}
        collaborateurId={selectedCollaborateurId}
      />
      {selectedCollaborateurId && <OffreCollab collaborateurId={selectedCollaborateurId} />}
    </div>
  );
}

export default ListCollaborateur;
