import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css'; // Assuming CSS from previous examples
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import StarRating from './StarRating'; // Make sure this is imported correctly
import ReactPaginate from 'react-paginate';

function OffreCollabEmploye({ collaborateurId}) {
  const [offres, setOffres] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('tous'); // Added filter state
  const token = localStorage.getItem('login');
  const navigate = useNavigate();
 const [currentPage, setCurrentPage] = useState(0);
 const [offresPerPage] = useState(6); 
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

  const filteredOffres = offres.filter(
    (offre) => filter === 'tous' || offre.type === filter
  );
  const pageCount = Math.ceil(filteredOffres.length / offresPerPage);
  const currentOffres = filteredOffres.slice(
    currentPage * offresPerPage,
    (currentPage + 1) * offresPerPage
  );
  const calculateDaysUntil = (date) => {
    const now = new Date();
    const endDate = new Date(date);
    const timeDiff = endDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (daysDiff > 0) {
      return `Remise expire dans ${daysDiff} jours`;
    } else if (daysDiff === 0) {
      return "Remise expire aujourd'hui";
    } else {
      return null;
    }
  };
  return (
    <>
      <Navbar />
      <div className="offre-employee-container">
        <h1 className="offre-employee-title">LES OFFRES DISPONIBLES</h1>
        <div className="filters">
          {['tous', 'hotel', 'voyage', 'activite'].map((f) => (
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
              currentOffres.map((offre, index) => (
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
                  <h3
                    style={{
                      margin: '10px 0',
                      fontSize: '17px',
                      color: '#232C5F',
                      fontWeight: 'bold',
                    }}
                  >
                    <span className="apartir">A partir de</span>{' '}
                    <span style={{ color: '#f00', fontSize: '21px' }}>
                      {offre.prix} TND
                    </span>
                  </h3>
                  {offre.date_fin && (
                    <div className="date-expiration">
                      <p>{calculateDaysUntil(offre.date_fin)}</p>
                    </div>
                  )}
                  <StarRating
                    rating={parseFloat(offre.evaluation.averageVotes)}
                    numReviews={offre.evaluation.numberOfEvaluations}
                  />
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
        <ReactPaginate
          previousLabel={'⬅️'}
          nextLabel={'➡️'}
          pageCount={pageCount}
          breakLabel={'...'}
          breakClassName={'break-me'}
          onPageChange={(data) => setCurrentPage(data.selected)}
          containerClassName={'pagination'}
          activeClassName={'active'}
          previousClassName={'pagination-previous'}
          nextClassName={'pagination-next'}
          disabledClassName={'pagination-disabled'}
        />
      </div>
    </>
  );
}

export default OffreCollabEmploye;
