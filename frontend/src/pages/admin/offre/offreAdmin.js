import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OffreAdmin.css';
import AddOffreModal from './AddOffreModal';
import UpdateOffreModal from './UpdateOffreModal';
import '../NavAdmin/navAdmin';
import NavAdmin from '../NavAdmin/navAdmin';
import { Link } from 'react-router-dom';
import ScrollToTop from '../../../components/designs/ScrollToTop';
import ReactPaginate from 'react-paginate';

function OffreAdmin({ isCollabMode, collaborateurId, onOffreAddedOrUpdated }) {
  const [offres, setOffres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffreId, setSelectedOffreId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offreAddedOrUpdated, setOffreAddedOrUpdated] = useState(false);
  const token = localStorage.getItem('login');
  const [categoryFilter, setCategoryFilter] = useState('tous');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchOffres = async () => {
      const url = isCollabMode
        ? `http://3.88.157.0/allOffersCollab/${collaborateurId}`
        : 'http://3.88.157.0/allOffers';

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
        await axios.delete(`http://3.88.157.0/offer/${offreId}`, {
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
  const offset = currentPage * itemsPerPage;
  const currentOffres = filteredOffres
    .filter(
      (offre) => categoryFilter === 'tous' || offre.type === categoryFilter
    )
    .slice(offset, offset + itemsPerPage);
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
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
      <ScrollToTop />

      <NavAdmin />
      <div className="offre-admin-container">
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
        <div className="category-filters">
          {['tous', 'hotel', 'voyage', 'activite'].map((f) => (
            <button
              key={f}
              onClick={() => setCategoryFilter(f)}
              className={
                categoryFilter === f ? 'active-filter-button' : 'filter-button'
              }
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="offre-cards-container">
          {currentOffres
            .filter(
              (offre) =>
                categoryFilter === 'tous' || offre.type === categoryFilter
            )
            .map((offre, index) => (
              <div key={index} className="offre-card">
                <Link
                  to={`/OffreAdminDetails/${offre.id_offre}`}
                  className="offre-card-content"
                >
                  <h2>{offre.titre}</h2>
                  <img
                    src={`http://3.88.157.0/${
                      offre.lesImages[offre.currentImageIndex]?.image
                    }`}
                    alt={`Image ${offre.currentImageIndex}`}
                  />
                  <p>
                    <strong>Collaborateur:</strong>
                    <span className="text-after-colon">
                      {offre.collaborateur?.nom}
                    </span>
                  </p>
                </Link>
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
                </div>
              </div>
            ))}
        </div>
        <ReactPaginate
          previousLabel={'⬅️'}
          nextLabel={'➡️'}
          breakLabel={'...'}
          breakClassName={'break-me'}
          pageCount={Math.ceil(
            offres.filter(
              (offre) =>
                categoryFilter === 'tous' || offre.type === categoryFilter
            ).length / itemsPerPage
          )}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={'pagination'}
          activeClassName={'active'}
          previousClassName={'pagination-previous'}
          nextClassName={'pagination-next'}
        />
      </div>
    </>
  );
}

export default OffreAdmin;
/*   <Link
                    to={`/OffreAdminDetails/${offre.id_offre}`}
                    className="see-more-link"
                  >
                    VOIR PLUS
                  </Link> */
