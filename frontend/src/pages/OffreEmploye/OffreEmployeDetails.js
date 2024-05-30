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
import { useTranslation } from 'react-i18next';
import loa from '../../assets/loa.gif';

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
  faCalendarAlt,
  faCheckSquare,
  faClock,
  faMoneyBillWave,
  faCar,
  faTableTennis,
  faBaby,
  faShoePrints,
  faUserTie,
  faTemperatureHigh,
  faSpa,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import ProgramModal from './ProgramModal';
import parse from 'html-react-parser';
import ScrollToTop from '../../components/designs/ScrollToTop';
import StarRating from './StarRating'; 

function OffreEmployeDetails() {
    const { t } = useTranslation();
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
          `http://localhost:5000/employeOffer/${offreId}`, 
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setOffre(response.data); 
        console.log('API Response:', response.data); 
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
        setIsAdherant(false); 
      }
    };

    checkAdherantStatus();
    fetchOffreDetails();
  }, [offreId, token]);

  if (!offre) {
    return (
      <div>
        <img src={loa} alt="Loading..." />
      </div>
    );
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
    prix_enfants_payants,
    nombre_enfants_gratuits,
    age_limit_gratuite,
    evaluation,
    enfants_autorises,
  } = offre;

  const handleImageClick = (clickedIndex) => {
    setOffre((currentOffre) => {
      let newLesImages = [...currentOffre.lesImages];
      [newLesImages[0], newLesImages[clickedIndex]] = [
        newLesImages[clickedIndex],
        newLesImages[0],
      ];
      return { ...currentOffre, lesImages: newLesImages };
    });
  };
  const openProgramModal = () => setIsProgramModalOpen(true);

const closeProgramModal = () => {
  console.log('Fermeture du modal');
  setIsProgramModalOpen(false);
};
const handlePaymentMethod = (method) => {
  setOffre((currentOffre) => ({ ...currentOffre, mode_paiement: method }));
};

const handleAuthorizationChange = () => {
  setOffre((currentOffre) => ({
    ...currentOffre,
    autorisation_deduction_salaire:
      !currentOffre.autorisation_deduction_salaire,
  }));
};
 const renderInterdictions = () => {
   const interdictions = [
     { label: t('Célibataires'), value: offre.details.interdit_celibataires },
     { label: 'Burkinis', value: offre.details.interdit_burkini },
     { label: t('Alcool'), value: offre.details.interdit_alcohol },
   ];

  const interdictionsActives = interdictions.filter((inter) => inter.value);

   return (
     <span className="interdictionsEmp">
       {interdictionsActives.map((interdiction, index) => (
         <span key={index} className="interdiction-itemEmp">
           <FontAwesomeIcon icon={faBan} className="interdiction-iconEmp" />
          {""} {interdiction.label}
           {index < interdictionsActives.length - 1 ? ' | ' : ''}
         </span>
       ))}
     </span>
   );
 };
  return (
    <>
      <Navbar />
      <NavbarHaut />
      <ScrollToTop />

      <div>
        <button className="retour-btn" onClick={() => window.history.back()}>
          <FaArrowLeft />
         {''} {t('Retour')}
        </button>
        <button
          className="details-link"
          onClick={() => (window.location = '#detailsSection')}
        >
          {t('Découvrir plus')} 👇
        </button>
        <h2 className="offre-titleDetails">{offre.titre}</h2>

        <div className="offre-cardDetails">
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
            <h4 className="destination-details">
              <FontAwesomeIcon
                icon={faMapMarkerAlt}
                className="destination-icon"
              />{' '}
              Destination: {offre.destination}
            </h4>
            <p className="offre-priceDetails"> {offre.prix} TND</p>
            <p className="offre-rating left-align-text">
              {t('Évaluations')} :
              <StarRating
                rating={parseFloat(offre.evaluation.averageVotes)}
                numReviews={offre.evaluation.numberOfEvaluations}
              />{' '}
            </p>
            <p className="offre-collaborateur left-align-text">
              {t('Collaborateur')} : {offre.collaborateur.nom}
            </p>
            <p className="offre-descriptionDetails">{offre.description}</p>

            <div className="offre-buttonsDetails">
              <button
                className="offre-button-reserverDetails"
                onClick={() => setIsModalOpen(true)}
              >
                {t('Réserver')}
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
                prix_enfants_payants={prix_enfants_payants}
                nombre_enfants_gratuits={nombre_enfants_gratuits}
                enfants_autorises={enfants_autorises}
              />
              {isAdherant === false && (
                <button
                  className="offre-button-adherantDetails"
                  onClick={() => setIsAdherantModalOpen(true)}
                >
                  {t('Adhérent')}
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
              onClick={() => handleImageClick(index + 1)}
            />
          ))}
        </div>
        {details && (
          <div id="detailsSection" className="offre-type-specific-details">
            {type === 'hotel' && (
              <>
                <div className="details-card ">
                  <h3 className="hotel-name">
                    {' '}
                    {t("Présentation de l'Hôtel")}{' '}
                  </h3>
                  <p className="hotel-name">
                    <strong>Hotel:</strong> {details.nom_hotel}
                  </p>
                  <p className="hotel-stars">
                    <strong>{t('Étoiles')}:</strong>{' '}
                    {'★'.repeat(details.etoiles)}
                  </p>
                  <p>{renderInterdictions()}</p>
                </div>
                <div className="hotel-services hotel-details-card ">
                  <h3 className="hotel-name">{t('Equipements')}</h3>

                  {details.climatisation && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faSnowflake}
                        className="service-icon"
                      />{' '}
                      {t('Climatisation')}
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
                      {t('Piscine Extérieure')}
                    </p>
                  )}
                  {details.piscine_couverte && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faWater}
                        className="service-icon"
                      />{' '}
                      {t('Piscine Couverte')}
                    </p>
                  )}
                  {details.bassin_enfants && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faChild}
                        className="service-icon"
                      />{' '}
                      {t('Bassin pour enfants')}
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
                      {t('Discothèque')}
                    </p>
                  )}
                  {details.plage_privee && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faUmbrellaBeach}
                        className="service-icon"
                      />{' '}
                      {t('Plage privée')}
                    </p>
                  )}
                  {details.ascenseur && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="service-icon"
                      />{' '}
                      {t('Ascenseur')}
                    </p>
                  )}
                  {details.salle_de_sport && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faDumbbell}
                        className="service-icon"
                      />{' '}
                      {t('Salle de sport')}
                    </p>
                  )}
                  {details.aire_de_jeux_enfants && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faGamepad}
                        className="service-icon"
                      />{' '}
                      {t('Aire de jeux pour enfants')}
                    </p>
                  )}
                  {details.spa && (
                    <p className="service-item">
                      <FontAwesomeIcon icon={faSpa} className="service-icon" />{' '}
                      Spa
                    </p>
                  )}
                  {details.sauna && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faTemperatureHigh}
                        className="service-icon"
                      />{' '}
                      Sauna
                    </p>
                  )}
                  {details.hammam && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faWater}
                        className="service-icon"
                      />{' '}
                      Hammam
                    </p>
                  )}
                  {details.thalasso && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faSwimmer}
                        className="service-icon"
                      />{' '}
                      Thalasso
                    </p>
                  )}
                  {details.centre_esthetique && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faUserTie}
                        className="service-icon"
                      />{' '}
                      {t('Centre Esthétique')}
                    </p>
                  )}
                  {details.toboggan && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faWater}
                        className="service-icon"
                      />{' '}
                      {t('Toboggan')}
                    </p>
                  )}
                  {details.pieds_dans_l_eau && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faShoePrints}
                        className="service-icon"
                      />{' '}
                      {t("Pieds dans l'Eau")}
                    </p>
                  )}
                  {details.piscine_eau_de_mer && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faWater}
                        className="service-icon"
                      />{' '}
                      {t('Piscine Eau de Mer')}
                    </p>
                  )}
                  {details.baby_setting && (
                    <p className="service-item">
                      <FontAwesomeIcon icon={faBaby} className="service-icon" />{' '}
                      {t("Garde d'enfants")}
                    </p>
                  )}
                  {details.tennis_de_table && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faTableTennis}
                        className="service-icon"
                      />{' '}
                      {t('Tennis de Table')}
                    </p>
                  )}
                  {details.location_de_voiture && (
                    <p className="service-item">
                      <FontAwesomeIcon icon={faCar} className="service-icon" />{' '}
                      {t('Location de Voiture')}
                    </p>
                  )}
                  {details.change_monetaire && (
                    <p className="service-item">
                      <FontAwesomeIcon
                        icon={faMoneyBillWave}
                        className="service-icon"
                      />{' '}
                      {t('Change Monétaire')}
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
                      : t('Non spécifié')
                  }
                />

                <p>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="service-icon"
                  />{' '}
                  {'Nombre de jours'}: {details.nbr_jours}
                </p>
                <p className="offre-inclus">
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className="service-icon"
                  />{' '}
                  {t('Inclus')}: {details.inclus}
                </p>
              </div>
            )}

            {type === 'activite' && (
              <div className="details-card">
                <h3>Détails de l'Activité</h3>
                <button onClick={openProgramModal} className="program-button">
                  {t('Voir Programme')}
                </button>
                <ProgramModal
                  isOpen={isProgramModalOpen}
                  onClose={closeProgramModal}
                  content={
                    details.programme
                      ? parse(offre.details.programme)
                      : t('Non spécifié')
                  }
                />
                <p>
                  <FontAwesomeIcon icon={faClock} className="service-icon" />{' '}
                  {t('Durée')}: {details.duree} heures
                </p>
                <p className="offre-inclus">
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className="service-icon"
                  />{' '}
                  {t('Inclus')}: {details.inclus}
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