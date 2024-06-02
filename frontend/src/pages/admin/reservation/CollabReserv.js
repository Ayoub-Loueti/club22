import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './collabResev.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import ListReservation from './listReservation';
import ListResevClick from './listReservClick';

function CollaborateurPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showOffreCollab, setShowOffreCollab] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      const fetchCollaborateurs = async () => {
        try {
          const response = await axios.get(
            'http://54.87.28.4/allCollaborateursAD',
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
    setSelectedCollaborateurId(collaborateurId);
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
    setSelectedCollaborateurId(null);
  };

  return (
    <>
      <div className="PageCollaborateur-container">
        {showOffreCollab && (
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
                  selectedCollaborateurId === collaborateur.id_collaborateur
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  handleCollaboratorClick(collaborateur.id_collaborateur)
                }
              >
                <img
                  src={`http://54.87.28.4/${collaborateur.logo}`}
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
        {showOffreCollab ? (
          <ListResevClick collaborateurId={selectedCollaborateurId} />
        ) : (
          <ListReservation />
        )}
      </div>
    </>
  );
}

export default CollaborateurPage;
