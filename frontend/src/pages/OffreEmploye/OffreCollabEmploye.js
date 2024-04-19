import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';

function OffreCollabEmploye({ collaborateurId }) {
  const [offres, setOffres] = useState([]);
  const [error, setError] = useState(null);  // State to track request errors
  const token = localStorage.getItem('login');
  const navigate = useNavigate();

  useEffect(() => {
    if (collaborateurId) {
      // Removed console.log for collaborateurId
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
          const updatedOffres = response.data.map((offre) => ({
            ...offre,
            currentImageIndex: 0,
          }));
          setOffres(updatedOffres);
          setError(null); // Reset error state on successful fetch
        } catch (error) {
          // Removed console.error; keep error handling silent
          setError("Il n'y a pas des offres disponibles pour ce collaborateur à ce moment.");  // Set user-friendly error message
        }
      };
      fetchOffres();
    }
  }, [collaborateurId, token]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (offres.length > 0 && offres[0].lesImages.length > 0) {
        setOffres((prevOffres) =>
          prevOffres.map((offre) => {
            const newImageIndex =
              (offre.currentImageIndex + 1) % offre.lesImages.length;
            return { ...offre, currentImageIndex: newImageIndex };
          })
        );
      }
    }, 4000);

    return () => clearInterval(intervalId);
  }, [offres]); // Ensure dependency on offres to capture updates correctly

  const handleVoirPlusClick = (offreId) => {
    navigate(`/OffrePageDetails/${offreId}`);
  };
  
  return (
    <>
      <Navbar />
      <div className="offre-employee-container">
        <h1 className="offre-employee-title">Les Offres disponibles</h1>
        {error ? (
          <div className="error-message">
            <h2>{error}</h2>
          </div>
        ) : (
          <div className="offre-employee-cards-container">
            {offres.length > 0 ? (
              offres.map((offre, index) => (
                <div key={index} className="offre-employee-card">
                  <img
                    src={`http://localhost:5000/${offre.lesImages[offre.currentImageIndex]?.image}`}
                    alt={`Image ${offre.currentImageIndex + 1} of ${offre.titre}`}
                  />
                  <div className="remise-badge">{offre.remise}%</div>
                  <h2>{offre.titre}</h2>
                  <button
                    className="voirPlusOffre"
                    onClick={() => handleVoirPlusClick(offre.id_offre)}
                  >
                    VOIR PLUS
                  </button>
                </div>
              ))
            ) : (
              <div className="no-offres-message">
                <h2>Il n'y a pas des offres à ce moment.</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default OffreCollabEmploye;
