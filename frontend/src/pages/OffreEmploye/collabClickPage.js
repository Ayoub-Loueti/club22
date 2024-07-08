import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './collaborateurPage.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useParams } from 'react-router-dom'; // Continue using useParams to capture URL params
import OffreEmploye from './OffreEmploye';
import OffreCollabEmploye from './OffreCollabEmploye';
import NavbarHaut from '../../components/navbar/navbarHaut';
import Hero from '../../components/designs/Hero';
import ScrollToTop from '../../components/designs/ScrollToTop';
import { useTranslation } from 'react-i18next';

function CollaborateurPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showOffreCollab, setShowOffreCollab] = useState(false);
  const { t } = useTranslation();

  const { collabId } = useParams(); 

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
          if (collabId && response.data.some(collab => collab.id_collaborateur.toString() === collabId)) {
            setSelectedCollaborateurId(collabId);
            setShowOffreCollab(true);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      };
      fetchCollaborateurs();
    }
  }, [collabId]);

  const handleCollaboratorClick = (collaborateurId) => {
    setSelectedCollaborateurId(collaborateurId);
    setShowOffreCollab(true);
    window.history.pushState({}, '', `/collabPage/${collaborateurId}`); 
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
    window.history.pushState({}, '', '/collabPage'); 
  };
  const [filteredOffers, setFilteredOffers] = useState([]);

  return (
    <>
      <NavbarHaut />

      <Hero onFiltered={setFilteredOffers} />
      <ScrollToTop />

      <div>
        {showOffreCollab && (
          <button className="voir-tous-btn" onClick={handleViewAllOffers}>
           { t('Tous les offres')}
          </button>
        )}
        <div className="PageCollaborateur-container">
          <div className="collabora-scroll-container">
            {collaborateurs
              .slice(startIndex, startIndex + 6)
              .map((collaborateur, index) => (
                <div
                  key={index}
                  className={`collab-card ${
                    selectedCollaborateurId ===
                    collaborateur.id_collaborateur.toString()
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    handleCollaboratorClick(
                      collaborateur.id_collaborateur.toString()
                    )
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
            <FaArrowLeft onClick={handlePrevious} className="nav-icon" />
            <FaArrowRight onClick={handleNext} className="nav-icon" />
          </div>

          {showOffreCollab ? (
            <OffreCollabEmploye collaborateurId={selectedCollaborateurId} />
          ) : (
            <OffreEmploye offers={filteredOffers} />
          )}
        </div>
      </div>
    </>
  );
}

export default CollaborateurPage;
