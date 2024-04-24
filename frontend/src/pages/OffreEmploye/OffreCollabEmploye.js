import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css'; // Assuming CSS from previous examples
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';

function OffreCollabEmploye({ collaborateurId }) {
  const [offres, setOffres] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('tous'); // Added filter state
  const token = localStorage.getItem('login');
  const navigate = useNavigate();

  useEffect(() => {
    if (collaborateurId) {
      const fetchOffres = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/allOffersCollab/${collaborateurId}${filter !== 'tous' ? `?type=${filter}` : ''}`,
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
          setError(null);
        } catch (error) {
          setError("Il n'y a pas d'offres disponibles pour ce collaborateur à ce moment.");
          console.error('Error fetching offres:', error);
        }
      };
      fetchOffres();
    }
  }, [collaborateurId, filter, token]);

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
  }, [offres]);

  const handleVoirPlusClick = (offreId) => {
    navigate(`/OffrePageDetails/${offreId}`);
  };

  const filteredOffres = offres.filter(offre => filter === 'tous' || offre.type === filter);

  return (
    <>
      <Navbar />
      <div className="offre-employee-container">
        <h1 className="offre-employee-title">LES OFFRES DISPONIBLES</h1>
        <div className="filters">
          {['tous', 'hotel', 'voyage', 'activité'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'active' : ''}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        {error ? (
          <div className="error-message">
            <h2>{error}</h2>
          </div>
        ) : (
          <div className="offre-employee-cards-container">
            {filteredOffres.length > 0 ? (
              filteredOffres.map((offre, index) => (
                <div key={index} className="offre-employee-card">
                  <img
                    src={`http://localhost:5000/${
                      offre.lesImages[offre.currentImageIndex]?.image
                    }`}
                    alt={`Image ${offre.currentImageIndex + 1} of ${
                      offre.titre
                    }`}
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
                <h2>Il n'y a pas d'offres à ce moment.</h2>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default OffreCollabEmploye;
