import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './OffreAdminDetails.css';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import UpdateOffreModal from './UpdateOffreModal';
import ScrollToTop from '../../../components/designs/ScrollToTop';
import NavAdmin from '../NavAdmin/navAdmin';

function OffreAdminDetails() {
  const { offreId } = useParams();
  const [offre, setOffre] = useState(null);
  const token = localStorage.getItem('login');
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offreAddedOrUpdated, setOffreAddedOrUpdated] = useState(false);
  const [selectedOffreId, setSelectedOffreId] = useState(null);
  const [offreUpdated, setOffreUpdated] = useState(false); // État pour suivre les mises à jour

  useEffect(() => {
    const fetchOffreDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/offer/${offreId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setOffre(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de l'offre:",
          error
        );
      }
    };

    fetchOffreDetails();
  }, [offreId, token, offreUpdated]);

  if (!offre) {
    return <div>Chargement des détails de l'offre...</div>;
  }



 
  const handleDelete = async (offreId) => {
    const confirmation = await Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer cette offre ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/offer/${offreId}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setOffreAddedOrUpdated((prev) => !prev);
        Swal.fire('Succès', 'Offre supprimée avec succès', 'success');
      } catch (error) {
        console.error("Erreur lors de la suppression de l'offre:", error);
        Swal.fire('Erreur', "Échec de la suppression de l'offre", 'error');
      }
    }
  };
  const handleUpdate = (offreId) => {
    setSelectedOffreId(offreId);
    setIsUpdateModalOpen(true);
  };
   const handleUpdateSuccess = () => {
     setOffreUpdated(!offreUpdated); // Basculer l'état pour forcer le rechargement
   };

  return (
    <>
      <NavAdmin />

      <ScrollToTop />

      <UpdateOffreModal
        isOpen={isUpdateModalOpen}
        offreId={selectedOffreId}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleUpdateSuccess} // Passer le callback de succès
      />
      <div className="contOffreAdminDetails-container">
        <Link to="/OffreAdmin" className="contOffreAdminDetails-retour-btn">
          Retour
        </Link>
        <h1>Détails de l'Offre</h1>
        <div className="contOffreAdminDetails-details">
          <h2>{offre.titre}</h2>
          <strong>Catégorie: </strong>
          <span className="text-after-colon">{offre.type}</span>
          <div className="contOffreAdminDetails-images-container">
            {offre.lesImages.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img.image}`}
                alt={`Image ${index}`}
              />
            ))}
          </div>
          <p>
            <strong>Description:</strong> {offre.description}
          </p>
          <p>
            <strong>Prix:</strong> {offre.prix} DT
          </p>
          <p>
            <strong>Remise:</strong> {offre.remise}%
          </p>
          {offre.remise > 0 &&
            offre.date_debut !== '0000-00-00' &&
            offre.date_fin !== '0000-00-00' && (
              <>
                <p>
                  <strong>Date de début:</strong> {offre.date_debut}
                </p>
                <p>
                  <strong>Date de fin:</strong> {offre.date_fin}
                </p>
              </>
            )}
          <p>
            <strong>Type:</strong> {offre.type}
          </p>
          <p>
            <strong>Destination:</strong> {offre.destination || 'Non spécifié'}
          </p>
          <p>
            <strong>Enfants Autorisés:</strong>{' '}
            {offre.enfants_autorises ? 'Oui' : 'Non'}
          </p>
          {offre.enfants_autorises && (
            <>
              <p>
                <strong>Âge Limite Gratuite:</strong>{' '}
                {offre.age_limite_gratuite} ans
              </p>
              <p>
                <strong>Nombre d'Enfants Gratuits:</strong>{' '}
                {offre.nombre_enfants_gratuits}
              </p>
              <p>
                <strong>Prix Enfants Payants:</strong>{' '}
                {offre.prix_enfants_payants} TND
              </p>
              <p>
                <strong>Conditions Spéciales Enfants:</strong>{' '}
                {offre.conditions_speciales_enfants}
              </p>
            </>
          )}
          <p>
            <strong>Collaborateur:</strong> {offre.collaborateur.nom}
          </p>
          {offre.details && (
            <>
              {offre.type === 'hotel' && (
                <>
                  <p>
                    <strong>Nom de l'hôtel:</strong> {offre.details.nom_hotel}
                  </p>
                  <p>
                    <strong>Étoiles:</strong> {offre.details.etoiles}
                  </p>
                  <p>
                    <strong>Climatisation:</strong>{' '}
                    {offre.details.climatisation ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Wi-Fi:</strong> {offre.details.wifi ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Piscine Extérieure:</strong>{' '}
                    {offre.details.piscine_exterieure ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Piscine Couverte:</strong>{' '}
                    {offre.details.piscine_couverte ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Bassin pour Enfants:</strong>{' '}
                    {offre.details.bassin_enfants ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Parking:</strong>{' '}
                    {offre.details.parking ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Discothèque:</strong>{' '}
                    {offre.details.discotheque ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Plage Privée:</strong>{' '}
                    {offre.details.plage_privee ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Ascenseur:</strong>{' '}
                    {offre.details.ascenseur ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Salle de Sport:</strong>{' '}
                    {offre.details.salle_de_sport ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Aire de Jeux pour Enfants:</strong>{' '}
                    {offre.details.aire_de_jeux_enfants ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Spa:</strong> {offre.details.spa ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Sauna:</strong>{' '}
                    {offre.details.sauna ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Hammam:</strong>{' '}
                    {offre.details.hammam ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Thalasso:</strong>{' '}
                    {offre.details.thalasso ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Centre Esthétique:</strong>{' '}
                    {offre.details.centre_esthetique ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Toboggan:</strong>{' '}
                    {offre.details.toboggan ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Pieds dans l'Eau:</strong>{' '}
                    {offre.details.pieds_dans_l_eau ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Piscine Eau de Mer:</strong>{' '}
                    {offre.details.piscine_eau_de_mer ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Baby Setting:</strong>{' '}
                    {offre.details.baby_setting ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Tennis de Table:</strong>{' '}
                    {offre.details.tennis_de_table ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Location de Voiture:</strong>{' '}
                    {offre.details.location_de_voiture ? 'Oui' : 'Non'}
                  </p>
                  <p>
                    <strong>Change Monétaire:</strong>{' '}
                    {offre.details.change_monetaire ? 'Oui' : 'Non'}
                  </p>
                </>
              )}
              {offre.type === 'voyage' && (
                <>
                  <p>
                    <strong>Programme:</strong>{' '}
                    {offre.details.programme
                      ? parse(offre.details.programme)
                      : 'Non spécifié'}{' '}
                  </p>
                  <p>
                    <strong>Inclus:</strong>{' '}
                    {offre.details.inclus || 'Non spécifié'}
                  </p>
                  <p>
                    <strong>Nombre de jours:</strong>{' '}
                    {offre.details.nbr_jours || 'Non spécifié'}
                  </p>
                </>
              )}
              {offre.type === 'activite' && (
                <>
                  <p>
                    <strong>Programme:</strong>{' '}
                    {offre.details.programme
                      ? parse(offre.details.programme)
                      : 'Non spécifié'}{' '}
                  </p>
                  <p>
                    <strong>Inclus:</strong>{' '}
                    {offre.details.inclus || 'Non spécifié'}
                  </p>
                  <p>
                    <strong>Durée:</strong>{' '}
                    {offre.details.duree
                      ? `${offre.details.duree} heures`
                      : 'Non spécifié'}
                  </p>
                </>
              )}
              <div className="offre-card-actions">
                <button
                  onClick={() => handleUpdate(offre.id_offre)}
                  className="modifierOffreButton"
                >
                  MODIFIER
                </button>
                <button
                  onClick={() => handleDelete(offre.id_offre)}
                  className="supprimerOffreButton"
                >
                  SUPPRIMER
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OffreAdminDetails;