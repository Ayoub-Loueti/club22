import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmploye.css';
import { useParams } from 'react-router-dom';

function OffreEmployeDetails() {
  const [offre, setOffre] = useState(null);
  const token = localStorage.getItem('login');
  const { offreId } = useParams();
  useEffect(() => {
    const fetchOffreDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/employeOffer/${offreId}`, // Remplacez ID_DE_LOFFRE par l'ID de l'offre que vous souhaitez afficher
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setOffre(response.data); // Met à jour l'état avec les détails de l'offre
      } catch (error) {
        console.error('Error fetching offre details:', error);
      }
    };

    fetchOffreDetails();
  }, [offreId, token]);

  if (!offre) {
    return <div>Loading...</div>; // Affiche un message de chargement tant que les données de l'offre ne sont pas disponibles
  }

  return (
    <div className="offre-employe-container">
      <h1 className="offre-employe-title">Détails de l'Offre pour Employés</h1>
      <div className="offre-card">
        <img
          src={`http://localhost:5000/${
            offre.lesImages[offre.currentImageIndex]?.image
          }?offreId=${offre.id_offre}`}
          alt={`Image ${offre.currentImageIndex}`}
        />

        <h2>{offre.titre}</h2>
        <p>{offre.description}</p>
        <p>Date de début: {offre.date_debut}</p>
        <p>Date de fin: {offre.date_fin}</p>
        <p>Prix: {offre.prix}</p>
      </div>
    </div>
  );
}

export default OffreEmployeDetails;
