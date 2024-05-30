// OffreEmploye.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import StarRating from './StarRating'; // Make sure this is imported correctly
import ScrollToTop from '../../components/designs/ScrollToTop';
import ReactPaginate from 'react-paginate'; 
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronLeft, faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';

function OffreEmploye({ offers }) {
  const [offres, setOffres] = useState([]);
  const [filter, setFilter] = useState('tous');
  const token = localStorage.getItem('login');
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [offresPerPage] = useState(6); 
  const { t } = useTranslation();

  useEffect(() => {
    if (!offers || offers.length === 0) {
      const fetchOffres = async () => {
        try {
          const response = await axios.get(
            'http://localhost:5000/employeOffers',
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          setOffres(
            response.data.map((offre) => ({ ...offre, currentImageIndex: 0 }))
          );
        } catch (error) {
          console.error('Error fetching offres:', error);
        }
      };
      fetchOffres();
    } else {
      setOffres(offers);
    }
  }, [token, offers]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOffres((prevOffres) =>
        prevOffres.map((offre) => ({
          ...offre,
          currentImageIndex:
            (offre.currentImageIndex + 1) % offre.lesImages.length,
        }))
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

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
return `${t('Remise expire dans ')} ${daysDiff} ${t('jours')}`;
  } else if (daysDiff === 0) {
      return t("Remise expire aujourd'hui");
  } else {
    return null; 
  }
};
  return (
    <>
      <Navbar />
      <ScrollToTop />
      <div className="offre-employee-container">
        <h1 className="offre-employee-title">{t('LES OFFRES DISPONIBLES')}</h1>
        <div className="filters">
          {[t('tous'), t('hotel'), t('voyage'), t('activite')].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'active' : ''}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="offre-employee-cards-container">
          {currentOffres.map((offre, index) => (
            <div key={index} className="offre-employee-card">
              <img
                src={`http://localhost:5000/${
                  offre.lesImages[offre.currentImageIndex]?.image
                }`}
                alt={`Image ${offre.currentImageIndex}`}
              />
              {offre.remise > 0 && (
                <div className="remise-badge">{`${offre.remise
                  .toString()
                  .padStart(2, '0')}%`}</div>
              )}
              <h2>{offre.titre}</h2>
              <h3
                style={{
                  margin: '10px 0',
                  fontSize: '17px',
                  color: '#232C5F',
                  fontWeight: 'bold',
                }}
              >
                <span className="apartir">{t('A partir de')}</span>{' '}
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
                {t('VOIR PLUS')}
              </button>
            </div>
          ))}
        </div>
        <ReactPaginate
          previousLabel={<FontAwesomeIcon icon={faCircleChevronLeft} />}
          nextLabel={<FontAwesomeIcon icon={faCircleChevronRight} />}
          pageCount={pageCount}
          onPageChange={(data) => setCurrentPage(data.selected)}
          containerClassName={'pagination'}
          disabledClassName={'pagination-disabled'}
          activeClassName={'active'}
          previousClassName={'pagination-previous'}
          nextClassName={'pagination-next'}
          breakLabel={'...'}
          breakClassName={'break-me'}
        />
      </div>
    </>
  );
}

export default OffreEmploye;
