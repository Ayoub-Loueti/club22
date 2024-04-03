import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './collaborateurPage.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import OffreEmploye from './OffreEmploye';
import OffreCollabEmploye from './OffreCollabEmploye';

function CollaborateurPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showOffreCollab, setShowOffreCollab] = useState(false); // State variable to control which component to render

  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      const fetchCollaborateurs = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/allCollaborateursEmploye',
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
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
    console.log('Selected collaborateurId:', collaborateurId);
    setSelectedCollaborateurId(collaborateurId);
    setShowOffreCollab(true); // Switch to render OffreCollabEmploye component
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
    <div className="PageCollaborateur-container">
      <div className="collabora-scroll-container">
        {collaborateurs
          .slice(startIndex, startIndex + 6)
          .map((collaborateur, index) => (
            <div
              key={index}
              className="collab-card"
              onClick={() => handleCollaboratorClick(collaborateur.id_collaborateur)}
            >
              <img
                src={`http://localhost:5000/${collaborateur.logo}`}
                alt={collaborateur.nom}
              />
            </div>
          ))}
      </div>

      <div className="navig-buttons">
        <FaArrowLeft
          onClick={handlePrevious}
          disabled={startIndex === 0}
          className="nav-icon"
        />
        <FaArrowRight
          onClick={handleNext}
          disabled={startIndex + 4 >= collaborateurs.length}
          className="nav-icon"
        />
      </div>

      {showOffreCollab ? (
        <OffreCollabEmploye collaborateurId={selectedCollaborateurId} />
      ) : (
        <OffreEmploye />
      )}
    </div>
  );
}

export default CollaborateurPage;
