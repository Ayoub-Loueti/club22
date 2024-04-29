import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmployeDetails.css'; 
import { useParams } from 'react-router-dom';
import ReservationModal from '../../components/ReservationModel/ReservationModal';
import AdherantModal from '../../components/AdherantModal/AdherantModal';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';

function OffreEmployeDetails() {
  const [offre, setOffre] = useState(null);
  const token = localStorage.getItem('login');
  const { offreId } = useParams();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [isAdherantModalOpen, setIsAdherantModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [isAdherant, setIsAdherant] = useState(null);

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

    const checkAdherantStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/isAdherant', {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        });
        setIsAdherant(response.data.adherant);
      } catch (error) {
        console.error("Error checking adherant status:", error);
        setIsAdherant(false); // Assume non-adherant if there's an error
      }
    };

    checkAdherantStatus();
    fetchOffreDetails();
  }, [offreId, token]);

  if (!offre) {
    return <div>Loading...</div>; // Affiche un message de chargement tant que les données de l'offre ne sont pas disponibles
  }
  const {
    titre,
    description,
    date_debut,
    date_fin,
    prix,
    lesImages,
    remise,
    type,
    details,
  } = offre;

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
    <>
      <Navbar />
      <NavbarHaut />
      <div>
        <button className="retour-btn" onClick={() => window.history.back()}>
          <FaArrowLeft /> Retour
        </button>

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
            {offre.remise > 0 && (
              <div className="remise-badgee">
                {offre.remise.toString().padStart(2, '0')}%
              </div>
            )}
            <h2 className="offre-titleDetails">{offre.titre}</h2>
            <p className="offre-priceDetails"> {offre.prix} DT</p>
            <h4>Destination: {offre.destination}</h4>
            <p className="offre-descriptionDetails">{offre.description}</p>
            <div className="offre-buttonsDetails">
              <button
                className="offre-button-reserverDetails"
                onClick={() => setIsModalOpen(true)}
              >
                Réserver
              </button>
              <ReservationModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                user={user}
                offreId={offreId}
                prix={prix}
                remise={remise}
                type={type}
                isAdherant={isAdherant}
              />
              {isAdherant === false && (
                <button
                  className="offre-button-adherantDetails"
                  onClick={() => setIsAdherantModalOpen(true)}
                >
                  Adhérent
                </button>
              )}
              <AdherantModal
                isOpen={isAdherantModalOpen}
                onRequestClose={() => setIsAdherantModalOpen(false)}
                user={user}
              />
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
        {details && (
          <div className="offre-type-specific-details">
            {type === 'hotel' && (
              <div className="details-card">
                <h3>Détails de l'Hôtel</h3>
                <p>Nom: {details.nom_hotel}</p>
                <p>Étoiles: {details.etoiles}</p>
                <p>
                  Services:{' '}
                  {[
                    details.climatisation && 'Climatisation',
                    details.wifi && 'WiFi',
                    details.piscine_exterieure && 'Piscine Extérieure',
                    details.piscine_couverte && 'Piscine Couverte',
                    details.bassin_enfants && 'Bassin enfants',
                    details.parking && 'Parking',
                    details.discotheque && 'Discothèque',
                    details.plage_privee && 'Plage privée',
                    details.ascenseur && 'Ascenseur',
                    details.salle_de_sport && 'Salle de sport',
                    details.aire_de_jeux_enfants && 'Aire de jeux enfants',
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
            )}
            {type === 'voyage' && (
              <div className="details-card">
                <h3>Itinéraire du Voyage</h3>
                <p>Programme: {details.programme}</p>
                <p>Inclus: {details.inclus}</p>
                <p>Nombre de jours: {details.nbr_jours}</p>
              </div>
            )}
            {type === 'activite' && (
              <div className="details-card">
                <h3>Détails de l'Activité</h3>
                <p>Programme: {details.programme}</p>
                <p>Inclus: {details.inclus}</p>
                <p>Durée: {details.duree} heures</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default OffreEmployeDetails;