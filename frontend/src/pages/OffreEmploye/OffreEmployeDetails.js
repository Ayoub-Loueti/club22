import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmployeDetails.css'; 
import { useParams } from 'react-router-dom';
/*import ReservationModal from '../../components/ReservationModel/ReservationModal';
 */
function OffreEmployeDetails() {
  const [offre, setOffre] = useState(null);
  const token = localStorage.getItem('login');
  const { offreId } = useParams();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  /*  const [isModalOpen, setIsModalOpen] = useState(false); // To control the modal visibility 
  const user = JSON.parse(localStorage.getItem('user'));
  
  */
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

  const handleImageClick = (clickedIndex) => {
    setOffre((currentOffre) => {
      let newLesImages = [...currentOffre.lesImages];
      // Échanger la première image avec celle cliquée
      [newLesImages[0], newLesImages[clickedIndex]] = [
        newLesImages[clickedIndex],
        newLesImages[0],
      ];
      return { ...currentOffre, lesImages: newLesImages };
    });
  };

  return (
    <div>
      <div className="offre-cardDetails">
        {/* Image principale en grand format en dessous */}
        {offre.lesImages.length > 0 && (
          <img
            src={`http://localhost:5000/${offre.lesImages[0].image}`}
            alt="Image principale"
            className="offre-main-image"
          />
        )}

        <div className="offre-details">
          <h2 className="offre-titleDetails">{offre.titre}</h2>
          <p className="offre-priceDetails"> {offre.prix} DT</p>
          <p className="offre-descriptionDetails">{offre.description}</p>
          <div className="offre-buttonsDetails">
            <button className="offre-button-reserverDetails">Réserver</button>
            <button className="offre-button-adherantDetails">Adhérent</button>
          </div>
        </div>
      </div>
      <div className="offre-additional-images">
        {offre.lesImages.slice(1).map((image, index) => (
          <img
            key={index}
            src={`http://localhost:5000/${image.image}`}
            alt={`Image supplémentaire ${index + 1}`}
            className="offre-additional-image"
            onClick={() => handleImageClick(index + 1)} // Notez l'index + 1 ici
          />
        ))}
      </div>
    </div>
  );
}

export default OffreEmployeDetails;
/* <button className="offre-buttonDetails offre-button-reserverDetails" onClick={() => setIsModalOpen(true)}>   Réserver </button> <ReservationModal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)} user={user} offreId={offreId} />*/