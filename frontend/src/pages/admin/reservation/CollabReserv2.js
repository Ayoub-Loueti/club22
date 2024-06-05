import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './collabResev.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import DemandeReserClick from './demandeReservClick';
import DemandeReservation from './demandeReservation';
import NavbarHaut from '../../../components/navbar/navbarHaut';
function CollaborateurPage2() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId2, setSelectedCollaborateurId2] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showOffreCollab2, setShowOffreCollab] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      const fetchCollaborateurs = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/allCollaborateursAD',
            { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
          );
          setCollaborateurs(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchCollaborateurs();
    }
  }, []);

  const handleCollaboratorClick = (collaborateurId) => {
    setSelectedCollaborateurId2(collaborateurId);
    setShowOffreCollab(true);
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

  const handleViewAllOffers = () => {
    setShowOffreCollab(false);
    setSelectedCollaborateurId2(null);
  };

  return (
    <>
      <NavbarHaut />

      <div className="PageCollaborateur-container">
        {showOffreCollab2 && (
          <button className="voir-tous-bttn" onClick={handleViewAllOffers}>
            Tous les Réservations
          </button>
        )}
        <div className="collabora-scroll-container">
          {collaborateurs
            .slice(startIndex, startIndex + 6)
            .map((collaborateur, index) => (
              <div
                key={index}
                className={`collab-card ${
                  selectedCollaborateurId2 === collaborateur.id_collaborateur
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCollaboratorClick(collaborateur.id_collaborateur)
                }
              >
                <img
                  src={`http://localhost:5000/${collaborateur.logo}`}
                  alt={collaborateur.nom}
                />
                <div className="collab-card-title">{collaborateur.nom}</div>
              </div>
            ))}
        </div>
        <div className="navig-buttons">
          <FaArrowLeft
            onClick={handlePrevious}
            className="nav-icon"
            disabled={startIndex === 0}
          />
          <FaArrowRight
            onClick={handleNext}
            className="nav-icon"
            disabled={startIndex + 4 >= collaborateurs.length}
          />
        </div>
        {showOffreCollab2 ? (
          <DemandeReserClick collaborateurId={selectedCollaborateurId2} />
        ) : (
          <DemandeReservation />
        )}
      </div>
    </>
  );
}

export default CollaborateurPage2;
