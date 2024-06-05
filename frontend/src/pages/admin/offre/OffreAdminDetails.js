import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import './OffreAdminDetails.css';
import parse from 'html-react-parser';
import Swal from 'sweetalert2';
import UpdateOffreModal from './UpdateOffreModal';
import ScrollToTop from '../../../components/designs/ScrollToTop';
import NavAdmin from '../NavAdmin/navAdmin';
import NavbarHaut from '../../../components/navbar/navbarHaut';

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
  //cc
const renderInterdictions = () => {
  const interdictions = [
    { label: 'Célibataires', value: offre.details.interdit_celibataires },
    { label: 'Burkini', value: offre.details.interdit_burkini },
    { label: 'Alcool', value: offre.details.interdit_alcohol },
  ];

  return (
    <div className="interdictions-container">
      <h3>Interdictions</h3>
      <ul>
        {interdictions.map((interdiction, index) => (
          <li
            key={index}
            className={`interdiction-item ${
              interdiction.value ? 'not-allowed' : 'allowed'
            }`}
          >
            {interdiction.label}:{' '}
            {interdiction.value ? 'Non autorisé' : 'Autorisé'}
          </li>
        ))}
      </ul>
    </div>
  );
};

  return (
    <>
        {' '}
        <NavbarHaut />
      <NavAdmin />

      <ScrollToTop />
      <div>
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
              <strong>Destination:</strong>{' '}
              {offre.destination || 'Non spécifié'}
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
                    {renderInterdictions()}

                    <div>
                      <h3>Types de Chambres:</h3>
                      {offre.details.typechambres &&
                      offre.details.typechambres.length > 0 ? (
                        offre.details.typechambres.map((typeChambre, index) => (
                          <div key={index} className="type-chambre-container">
                            <p className="type-chambre-info">
                              <span className="type-chambre-label">
                                Nom de chambre:
                              </span>
                              <span className="type-chambre-value">
                                {typeChambre.nom}
                              </span>
                              <span className="type-chambre-label">
                                Supplément:
                              </span>
                              <span className="type-chambre-value">
                                {typeChambre.supplement} DT
                              </span>
                            </p>
                            <p>
                              <strong>Chambre par Défaut:</strong>{' '}
                              {typeChambre.defaultChambre ? 'Oui' : 'Non'}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p>Aucun type de chambre spécifié.</p>
                      )}
                    </div>
                    <div>
                      <h3>Options de Pension</h3>
                      <p>
                        Logement Seulement:{' '}
                        {offre.details.logement_seulement ? 'Oui' : 'Non'} -
                        Prix: {offre.details.prix_logement_seulement} DT
                      </p>
                      <p>
                        Petit Déjeuner:{' '}
                        {offre.details.petit_dejeuner ? 'Oui' : 'Non'} - Prix:{' '}
                        {offre.details.prix_petit_dejeuner} DT
                      </p>
                      <p>
                        Demi Pension:{' '}
                        {offre.details.demi_pension ? 'Oui' : 'Non'} - Prix:{' '}
                        {offre.details.prix_demi_pension} DT
                      </p>
                      <p>
                        Demi Pension Plus:{' '}
                        {offre.details.demi_pension_plus ? 'Oui' : 'Non'} -
                        Prix: {offre.details.prix_demi_pension_plus} DT
                      </p>
                      <p>
                        Pension Complète:{' '}
                        {offre.details.pension_complete ? 'Oui' : 'Non'} - Prix:{' '}
                        {offre.details.prix_pension_complete} DT
                      </p>
                      <p>
                        Pension Complète Plus:{' '}
                        {offre.details.pension_complete_plus ? 'Oui' : 'Non'} -
                        Prix: {offre.details.prix_pension_complete_plus} DT
                      </p>
                      <p>
                        All Inclusive:{' '}
                        {offre.details.all_inclusive ? 'Oui' : 'Non'} - Prix:{' '}
                        {offre.details.prix_all_inclusive} DT
                      </p>
                      <p>
                        All Inclusive Soft:{' '}
                        {offre.details.all_inclusive_soft ? 'Oui' : 'Non'} -
                        Prix: {offre.details.prix_all_inclusive_soft} DT
                      </p>
                    </div>

                    <div>
                      <h3>Suppléments et Vues</h3>
                      {offre.details.typechambres.map((typeChambre, index) => (
                        <div key={index} className="type-chambre-container">
                          <p className="type-chambre-info">
                            <strong>Nom de la chambre:</strong>{' '}
                            {typeChambre.nom}
                          </p>
                          <p className="type-chambre-info">
                            <span className="type-chambre-label">
                              Vue sur Mer:
                            </span>
                            <span className="type-chambre-value">
                              {typeChambre.vuemer ? 'Oui' : 'Non'} - Prix:{' '}
                              {typeChambre.supplementmer} DT
                            </span>
                          </p>
                          <p className="type-chambre-info">
                            <span className="type-chambre-label">
                              Vue sur Piscine:
                            </span>
                            <span className="type-chambre-value">
                              {typeChambre.vuepis ? 'Oui' : 'Non'} - Prix:{' '}
                              {typeChambre.supplementpis} DT
                            </span>
                          </p>
                          <p className="type-chambre-info">
                            <span className="type-chambre-label">Single:</span>
                            <span className="type-chambre-value">
                              {typeChambre.single ? 'Oui' : 'Non'} - Prix:{' '}
                              {typeChambre.prixsingle} DT
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="details-grid">
                      <div className="detail-card">
                        <span className="detail-label">Climatisation:</span>
                        <span
                          className={`detail-badge ${
                            offre.details.climatisation
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.climatisation ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Wi-Fi:</span>
                        <span
                          className={`detail-badge ${
                            offre.details.wifi ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {offre.details.wifi ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">
                          Piscine Extérieure:
                        </span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.piscine_exterieure
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {' '}
                          {offre.details.piscine_exterieure ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Piscine Couverte:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.piscine_couverte
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {' '}
                          {offre.details.piscine_couverte ? 'Oui' : 'Non'}
                        </span>{' '}
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">
                          Bassin pour Enfants:
                        </span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.bassin_enfants
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.bassin_enfants ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Parking:</span>
                        <span
                          className={`detail-badge ${
                            offre.details.parking ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {offre.details.parking ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Discothèque:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.discotheque
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.discotheque ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Plage Privée:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.plage_privee
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.plage_privee ? 'Oui' : 'Non'}
                        </span>
                      </div>{' '}
                      <div className="detail-card">
                        <span className="detail-label">Ascenseur:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.ascenseur
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.ascenseur ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Salle de sport:</span>
                        <span
                          className={`detail-badge ${
                            offre.details.salle_de_sport
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.salle_de_sport ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">
                          Aire de Jeux pour Enfants:
                        </span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.aire_de_jeux_enfants
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.aire_de_jeux_enfants ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Spa:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.spa ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {' '}
                          {offre.details.spa ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Sauna:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.sauna ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {offre.details.sauna ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Hammam:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.hammam ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {offre.details.hammam ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Thalasso:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.thalasso ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {' '}
                          {offre.details.thalasso ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Centre Esthétique:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.centre_esthetique
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.centre_esthetique ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Toboggan:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.toboggan ? 'detail-oui' : 'detail-non'
                          }`}
                        >
                          {offre.details.toboggan ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Pieds dans l'Eau:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.pieds_dans_l_eau
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.pieds_dans_l_eau ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">
                          Piscine Eau de Mer:
                        </span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.piscine_eau_de_mer
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.piscine_eau_de_mer ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Baby Setting:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.baby_setting
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.baby_setting ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Tennis de Table:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.tennis_de_table
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.tennis_de_table ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">
                          Location de Voiture:
                        </span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.location_de_voiture
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.location_de_voiture ? 'Oui' : 'Non'}
                        </span>
                      </div>
                      <div className="detail-card">
                        <span className="detail-label">Change Monétaire:</span>{' '}
                        <span
                          className={`detail-badge ${
                            offre.details.change_monetaire
                              ? 'detail-oui'
                              : 'detail-non'
                          }`}
                        >
                          {offre.details.change_monetaire ? 'Oui' : 'Non'}
                        </span>
                      </div>
                    </div>

                    <br></br>
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
      </div>
    </>
  );
}

export default OffreAdminDetails;
