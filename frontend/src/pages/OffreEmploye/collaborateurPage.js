import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './collaborateurPage.css';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import OffreEmploye from './OffreEmploye';
import OffreCollabEmploye from './OffreCollabEmploye';
import NavbarHaut from '../../components/navbar/navbarHaut';
import Hero from '../../components/designs/Hero';
import scrollreveal from 'scrollreveal';

function CollaborateurPage() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
  const [startIndex, setStartIndex] = useState(0);
  const [showOffreCollab, setShowOffreCollab] = useState(false);
 
  const [filteredOffers, setFilteredOffers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('login');
    if (token) {
      const fetchCollaborateurs = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/allCollaborateursEmploye',
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
 useEffect(() => {
   const sr = scrollreveal({
     origin: 'top',
     distance: '80px',
     duration: 2000,
     reset: true,
   });
   sr.reveal(
     `
        #hero,
        #services,
        #recommend,
        #testimonials,
        footer
        `,
     {
       opacity: 0,
       interval: 300,
     }
   );
 }, []);

  return (
    <>
      <NavbarHaut />
      <Hero onFiltered={setFilteredOffers} />

      <div>
        {showOffreCollab && (
          <button className="voir-tous-btn" onClick={handleViewAllOffers}>
            Tous les offres
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
                    selectedCollaborateurId === collaborateur.id_collaborateur
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
