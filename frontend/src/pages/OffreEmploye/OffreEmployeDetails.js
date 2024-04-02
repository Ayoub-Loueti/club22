import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmployeDetails.css'; 
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
        console.log('API Response:', response.data); // Log the response data
      } catch (error) {
        console.error('Error fetching offre details:', error);
      }
    };

    fetchOffreDetails();
  }, [offreId, token]);

  if (!offre) {
    return <div>Loading...</div>; // Affiche un message de chargement tant que les données de l'offre ne sont pas disponibles
  }
  const { titre, description, date_debut, date_fin, prix, lesImages } = offre;

  return (
    <div className="offre-cardDetails">
      <img
        src={`http://localhost:5000/${offre.lesImages[0].image}?offreId=${offre.id_offre}`}
        alt={`Image 0`}
      />
      <div className="offre-details">
        <h2 className="offre-titleDetails">{offre.titre}</h2>
        <p className="offre-priceDetails"> {offre.prix} DT</p>
        <p className="offre-descriptionDetails">{offre.description}</p>
        <div className="offre-buttonsDetails">
          <button className="offre-buttonDetails offre-button-reserverDetails">
            Réserver
          </button>
          <button className="offre-buttonDetails offre-button-adherantDetails">
            Adhérent
          </button>
        </div>
      </div>
    </div>
  );
}

export default OffreEmployeDetails;
