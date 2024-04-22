import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/navbar';

function OffreEmploye() {
  const [offres, setOffres] = useState([]);
  const [filter, setFilter] = useState('tous'); // to keep track of the selected filter
  const token = localStorage.getItem('login');
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [token]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOffres((prevOffres) =>
        prevOffres.map((offre) => {
          const newImageIndex =
            (offre.currentImageIndex + 1) % offre.lesImages.length;
          return { ...offre, currentImageIndex: newImageIndex };
        })
      );
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  const handleVoirPlusClick = (offreId) => {
    navigate(`/OffrePageDetails/${offreId}`);
  };

  const filteredOffres = offres.filter(offre => filter === 'tous' || offre.type === filter);

  return (
    <>
      <Navbar />
      <div className="offre-employee-container">
        <h1 className="offre-employee-title">Les Offres disponibles</h1>
        <div className="filters">
          {['tous', 'hotel', 'voyage', 'activité'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={filter === f ? "active" : ""}>
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="offre-employee-cards-container">
          {filteredOffres.map((offre, index) => (
            <div key={index} className="offre-employee-card">
              <img
                src={`http://localhost:5000/${offre.lesImages[offre.currentImageIndex]?.image}`}
                alt={`Image ${offre.currentImageIndex}`}
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
          ))}
        </div>
      </div>
    </>
  );
}

export default OffreEmploye;
