import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './OffreEmployeDetails.css'; 
import { useParams } from 'react-router-dom';
import ReservationModal from '../../components/ReservationModel/ReservationModal';
import AdherantModal from '../../components/AdherantModal/AdherantModal';
import { FaArrowLeft } from 'react-icons/fa';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSnowflake,
  faWifi,
  faSwimmer,
  faWater,
  faChild,
  faParking,
  faMusic,
  faUmbrellaBeach,
  faArrowUp,
  faDumbbell,
  faGamepad,
  faMapMarkerAlt,
  faSuitcaseRolling,
  faCalendarAlt,
  faCheckSquare,
  faClipboardList,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import ProgramModal from './ProgramModal';
import parse from 'html-react-parser';

function OffreEmployeDetails() {
  const [offre, setOffre] = useState(null);
  const token = localStorage.getItem('login');
  const { offreId } = useParams();
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdherantModalOpen, setIsAdherantModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [isAdherant, setIsAdherant] = useState(null);
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

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
        console.error('Error checking adherant status:', error);
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
  // Fonction pour ouvrir le modal
  const openProgramModal = () => setIsProgramModalOpen(true);

  // Fonction pour fermer le modal
const closeProgramModal = () => {
  console.log('Fermeture du modal');
  setIsProgramModalOpen(false);
};
const handlePaymentMethod = (method) => {
  // Update the mode_paiement state based on the selected method
  setOffre((currentOffre) => ({ ...currentOffre, mode_paiement: method }));
};

const handleAuthorizationChange = () => {
  // Toggle the authorization state for salary deduction
  setOffre((currentOffre) => ({
    ...currentOffre,
    autorisation_deduction_salaire:
      !currentOffre.autorisation_deduction_salaire,
  }));
};
  return (
    <>
      <Navbar />
      <NavbarHaut />
      <div>
        <button className="retour-btn" onClick={() => window.history.back()}>
          <FaArrowLeft /> Retour
        </button>
        <button
          className="details-link"
          onClick={() => (window.location = '#detailsSection')}
        >
          Plus de détails
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
            <h4 className="destination-details">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="destination-icon"
              />{' '}
              Destination: {offre.destination}
            </h4>
            <p className="offre-priceDetails"> {offre.prix} DT</p>

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
                debut={date_debut}
                fin={date_fin}
                details={details}
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
          <div id="detailsSection" className="offre-type-specific-details">
            {type === 'hotel' && (
              <>
                <div className="details-card ">
                  <h3 className="hotel-name"> Présentation de l'Hôtel </h3>
                  <p className="hotel-name">
                    <strong>Hotel:</strong> {details.nom_hotel}
                  </p>
                  <p className="hotel-stars">
                    <strong>Étoiles:</strong> {'★'.repeat(details.etoiles)}
                  </p>
                </div>
                <div className="hotel-services hotel-details-card ">
                  <h3 className="hotel-name">Equipements</h3>

                  {details.climatisation && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faSnowflake}
                        className="service-icon"
                      />{' '}
                      Climatisation
                    </p>
                  )}
                  {details.wifi && (
                    <p className="service-item">
                      <FontAwesomeIcon icon={faWifi} className="service-icon" />{' '}
                      WiFi
                    </p>
                  )}
                  {details.piscine_exterieure && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faSwimmer}
                        className="service-icon"
                      />{' '}
                      Piscine Extérieure
                    </p>
                  )}
                  {details.piscine_couverte && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faWater}
                        className="service-icon"
                      />{' '}
                      Piscine Couverte
                    </p>
                  )}
                  {details.bassin_enfants && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faChild}
                        className="service-icon"
                      />{' '}
                      Bassin pour enfants
                    </p>
                  )}
                  {details.parking && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faParking}
                        className="service-icon"
                      />{' '}
                      Parking
                    </p>
                  )}
                  {details.discotheque && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faMusic}
                        className="service-icon"
                      />{' '}
                      Discothèque
                    </p>
                  )}
                  {details.plage_privee && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faUmbrellaBeach}
                        className="service-icon"
                      />{' '}
                      Plage privée
                    </p>
                  )}
                  {details.ascenseur && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="service-icon"
                      />{' '}
                      Ascenseur
                    </p>
                  )}
                  {details.salle_de_sport && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className="service-icon"
                      />{' '}
                      Salle de sport
                    </p>
                  )}
                  {details.aire_de_jeux_enfants && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faGamepad}
                        className="service-icon"
                      />{' '}
                      Aire de jeux pour enfants
                    </p>
                  )}
                </div>
              </>
            )}
            {type === 'voyage' && (
              <div className="details-card">
                <h3>Itinéraire du Voyage</h3>
                <button onClick={openProgramModal} className="program-button">
                  Voir Programme
                </button>
                <ProgramModal
                  isOpen={isProgramModalOpen}
                  onClose={closeProgramModal}
                  content={
                    details.programme
                      ? parse(offre.details.programme)
                      : 'Non spécifié'
                  }
                />

                <p>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="service-icon"
                  />{' '}
                  Nombre de jours: {details.nbr_jours}
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className="service-icon"
                  />{' '}
                  Inclus: {details.inclus}
                </p>
              </div>
            )}

            {type === 'activite' && (
              <div className="details-card">
                <h3>Détails de l'Activité</h3>
                <button onClick={openProgramModal} className="program-button">
                  Voir Programme
                </button>
                <ProgramModal
                  isOpen={isProgramModalOpen}
                  onClose={closeProgramModal}
                  content={details.programme}
                />
                <p>
                  <FontAwesomeIcon icon={faClock} className="service-icon" />{' '}
                  Durée: {details.duree} heures
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className="service-icon"
                  />{' '}
                  Inclus: {details.inclus}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default OffreEmployeDetails;