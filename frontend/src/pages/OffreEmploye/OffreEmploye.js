// OffreEmploye.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';
import StarRating from './StarRating'; // Make sure this is imported correctly

function OffreEmploye() {
  const [offres, setOffres] = useState([]);
  const [filter, setFilter] = useState('tous');
  const token = localStorage.getItem('login');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await axios.get('http://localhost:5000/employeOffers', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setOffres(response.data.map(offre => ({ ...offre, currentImageIndex: 0 })));
      } catch (error) {
        console.error('Error fetching offres:', error);
      }
    };

    fetchOffres();
  }, [token]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOffres(prevOffres => prevOffres.map(offre => ({
        ...offre,
        currentImageIndex: (offre.currentImageIndex + 1) % offre.lesImages.length,
      })));
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  const handleVoirPlusClick = offreId => {
    navigate(`/OffrePageDetails/${offreId}`);
  };

  const filteredOffres = offres.filter(offre => filter === 'tous' || offre.type === filter);

  return (
    <>
      <Navbar />
      <div className="offre-employee-container">
        <h1 className="offre-employee-title">LES OFFRES DISPONIBLES</h1>
        <div className="filters">
          {['tous', 'hotel', 'voyage', 'activité'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? 'active' : ''}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="offre-employee-cards-container">
          {filteredOffres.map((offre, index) => (
            <div key={index} className="offre-employee-card">
              <img src={`http://localhost:5000/${offre.lesImages[offre.currentImageIndex]?.image}`} alt={`Image ${offre.currentImageIndex}`} />
              {offre.remise > 0 && <div className="remise-badge">{`${offre.remise}%`}</div>}
              <h2>{offre.titre}</h2>
              <StarRating rating={parseFloat(offre.evaluation.averageVotes)} numReviews={offre.evaluation.numberOfEvaluations} />
              <button className="voirPlusOffre" onClick={() => handleVoirPlusClick(offre.id_offre)}>
                VOIR PLUS
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default OffreEmploye;
