import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css';
import { useNavigate } from 'react-router-dom';

function OffreCollabEmploye({ collaborateurId }) {
  const [offres, setOffres] = useState([]);
  const token = localStorage.getItem('login');
  const navigate = useNavigate();

  useEffect(() => {
    if (collaborateurId) {
      console.log('Received collaborateurId in OffreEmploye:', collaborateurId);
      const fetchOffres = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/allOffersCollab/${collaborateurId}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          // Add currentImageIndex property to each offre object
          const updatedOffres = response.data.map((offre) => ({
            ...offre,
            currentImageIndex: 0,
          }));
          setOffres(updatedOffres);
        } catch (error) {
          console.error('Error fetching offres:', error);
        }
      };
      fetchOffres();
    }
  }, [collaborateurId, token]);

  const handleVoirPlusClick = (offreId) => {
    navigate(`/OffrePageDetails/${offreId}`);
  };

  return (
    <div className="offre-employee-container">
      <h1 className="offre-employee-title">Les Offres disponibles</h1>
      <div className="offre-employee-cards-container">
        {offres.map((offre, index) => (
          <div key={index} className="offre-employee-card">
            <img
              src={`http://localhost:5000/${
                offre.lesImages[offre.currentImageIndex]?.image
              }`}
              alt={`Image ${offre.currentImageIndex}`}
            />
            <h2>{offre.titre}</h2>
            <button
              className="voirPlusOffre"
              onClick={() => handleVoirPlusClick(offre.id_offre)}
            >
              VOIR PLUS
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OffreCollabEmploye;
