import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OffreAdmin.css';
import AddOffreModal from './AddOffreModal';
import UpdateOffreModal from './UpdateOffreModal';
import { FaArrowLeft } from 'react-icons/fa';
import '../NavAdmin/navAdmin';
import NavAdmin from '../NavAdmin/navAdmin';
function OffreAdmin({ isCollabMode, collaborateurId, onOffreAddedOrUpdated }) {
  const [offres, setOffres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffreId, setSelectedOffreId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offreAddedOrUpdated, setOffreAddedOrUpdated] = useState(false);
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchOffres = async () => {
      const url = isCollabMode
        ? `http://localhost:5000/allOffersCollab/${collaborateurId}`
        : 'http://localhost:5000/allOffers';

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });

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
  }, [isCollabMode, collaborateurId, offreAddedOrUpdated]);

  useEffect(() => {
    // Automatically switch to the next image for each offer every 5 seconds
    const intervalId = setInterval(() => {
      setOffres((prevOffres) =>
        prevOffres.map((offre) => ({
          ...offre,
          currentImageIndex:
            (offre.currentImageIndex + 1) % offre.lesImages.length,
        }))
      );
    }, 4000);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  const handleUpdate = (offreId) => {
    setSelectedOffreId(offreId);
    setIsUpdateModalOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddOrUpdateSuccess = () => {
    setOffreAddedOrUpdated((prev) => !prev);
  };

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
  const filteredOffres = offres.filter(
    (offre) =>
      offre.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offre.prix.toString().toLowerCase().includes(searchTerm.toLowerCase())
  );
/* function displayHotelAttributes(details) {
  const attributes = [
    { key: 'climatisation', label: 'Climatisation' },
    { key: 'wifi', label: 'Wi-Fi' },
    { key: 'piscine_exterieure', label: 'Piscine extérieure' },
    { key: 'piscine_couverte', label: 'Piscine couverte' },
    { key: 'bassin_enfants', label: 'Bassin enfants' },
    { key: 'parking', label: 'Parking' },
    { key: 'discotheque', label: 'Discothèque' },
    { key: 'plage_privee', label: 'Plage privée' },
    { key: 'ascenseur', label: 'Ascenseur' },
    { key: 'salle_de_sport', label: 'Salle de sport' },
    { key: 'aire_de_jeux_enfants', label: 'Aire de jeux enfants' },
  ];

  return attributes
    .filter((attr) => details[attr.key])
    .map((attr) => <p key={attr.key}>{attr.label}: Oui</p>);
}*/

  return (
    <>
      <NavAdmin />
      <div className="offre-admin-container">
        <button className="retour-btn" onClick={() => window.history.back()}>
          <FaArrowLeft /> Retour
        </button>
        <AddOffreModal
          isOpen={isModalOpen}
          onRequestClose={handleCloseModal}
          onSuccess={handleAddOrUpdateSuccess}
        />
        <UpdateOffreModal
          isOpen={isUpdateModalOpen}
          offreId={selectedOffreId}
          onRequestClose={() => setIsUpdateModalOpen(false)}
          onSuccess={handleAddOrUpdateSuccess}
        />
        <div className="offre-list-header">
          <h1 className="offre-list-title">LISTE DES OFFRES</h1>

          <input
            type="text"
            className="offre-list-search-input"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleOpenModal} className="add-offre-button">
            AJOUTER UNE OFFRE
          </button>
        </div>
        <div className="offre-cards-container">
          {filteredOffres.map((offre, index) => (
            <div key={index} className="offre-card">
              <div className="offre-card-content">
                <h2>{offre.titre}</h2>
                <img
                  src={`http://localhost:5000/${
                    offre.lesImages[offre.currentImageIndex]?.image
                  }`}
                  alt={`Image ${offre.currentImageIndex}`}
                />
                <div className="offDes">{offre.description}</div>{' '}
                <p>
                  Catégorie:{' '}
                  <span className="text-after-colon">{offre.type}</span>
                </p>
                <p>
                  Prix:<span className="text-after-colon">{offre.prix}DT</span>
                </p>
                {offre.remise > 0 && (
                  <p>
                    Remise:{' '}
                    <span className="text-after-colon">
                      {' '}
                      {offre.remise.toString().padStart(2, '0')}%
                    </span>
                  </p>
                )}
                <p>
                  Offre valable de:{' '}
                  <span className="text-after-colon">{offre.date_debut}</span>
                </p>
                <p>
                  Jusqu'au:{' '}
                  <span className="text-after-colon">{offre.date_fin}</span>
                </p>
                <p>
                  Collaborateur:{' '}
                  <span className="text-after-colon">
                    {offre.collaborateur?.nom}
                  </span>
                </p>
                {offre.type === 'voyage' && offre.details && (
                  <>
                    <p>
                      Programme: {offre.details.programme || 'Non spécifié'}
                    </p>
                    <p>Inclus: {offre.details.inclus || 'Non spécifié'}</p>
                    <p>
                      Nombre de jours:{' '}
                      {offre.details.nbr_jours || 'Non spécifié'}
                    </p>
                  </>
                )}
                {offre.type === 'hotel' && offre.details && (
                  <>
                    <p>
                      Nom de l'hôtel:{' '}
                      {offre.details.nom_hotel || 'Non spécifié'}
                    </p>
                    <p>Étoiles: {offre.details.etoiles || 'Non spécifié'}</p>
                    <p>
                      Climatisation:{' '}
                      {offre.details.climatisation ? 'Oui' : 'Non'}
                    </p>
                    <p>Wi-Fi: {offre.details.wifi ? 'Oui' : 'Non'}</p>
                    <p>
                      Piscine extérieure:{' '}
                      {offre.details.piscine_exterieure ? 'Oui' : 'Non'}
                    </p>
                    <p>
                      Piscine couverte:{' '}
                      {offre.details.piscine_couverte ? 'Oui' : 'Non'}
                    </p>
                    <p>
                      Bassin enfants:{' '}
                      {offre.details.bassin_enfants ? 'Oui' : 'Non'}
                    </p>
                    <p>Parking: {offre.details.parking ? 'Oui' : 'Non'}</p>
                    <p>
                      Discothèque: {offre.details.discotheque ? 'Oui' : 'Non'}
                    </p>
                    <p>
                      Plage privée: {offre.details.plage_privee ? 'Oui' : 'Non'}
                    </p>
                    <p>Ascenseur: {offre.details.ascenseur ? 'Oui' : 'Non'}</p>
                    <p>
                      Salle de sport:{' '}
                      {offre.details.salle_de_sport ? 'Oui' : 'Non'}
                    </p>
                    <p>
                      Aire de jeux enfants:{' '}
                      {offre.details.aire_de_jeux_enfants ? 'Oui' : 'Non'}
                    </p>
                  </>
                )}
                {offre.type === 'activite' && offre.details && (
                  <>
                    <p>
                      Programme: {offre.details.programme || 'Non spécifié'}
                    </p>
                    <p>Inclus: {offre.details.inclus || 'Non spécifié'}</p>
                    <p>
                      Durée:{' '}
                      {offre.details.duree
                        ? `${offre.details.duree} heures`
                        : 'Non spécifié'}
                    </p>
                  </>
                )}
              </div>
              <div className="offre-card-actions">
                <button
                  onClick={() => handleUpdate(offre.id_offre)}
                  className="modifierOffreButton"
                >
                  MODIFIER
                </button>
                <button onClick={() => handleDelete(offre.id_offre)}>
                  SUPPRIMER
                </button>
              </div>{' '}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default OffreAdmin;
