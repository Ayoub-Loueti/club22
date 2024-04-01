import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OffreAdmin.css';
import AddOffreModal from './AddOffreModal';
import UpdateOffreModal from './UpdateOffreModal';

function OffreAdmin() {
  const [offres, setOffres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffreId, setSelectedOffreId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offreAddedOrUpdated, setOffreAddedOrUpdated] = useState(false);
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const response = await axios.get('http://localhost:5000/allOffers', {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        // Add currentImageIndex property to each offre object
        const updatedOffres = response.data.map(offre => ({
          ...offre,
          currentImageIndex: 0
        }));
        setOffres(updatedOffres);
      } catch (error) {
        console.error('Error fetching offres:', error);
      }
    };

    fetchOffres();
  }, [offreAddedOrUpdated, token]);

  useEffect(() => {
    // Automatically switch to the next image for each offer every 5 seconds
    const intervalId = setInterval(() => {
      setOffres(prevOffres => prevOffres.map(offre => ({
        ...offre,
        currentImageIndex: (offre.currentImageIndex + 1) % offre.lesImages.length
      })));
    }, 5000);

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
    setOffreAddedOrUpdated(prev => !prev);
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
        setOffreAddedOrUpdated(prev => !prev);
        Swal.fire('Succès', 'Offre supprimée avec succès', 'success');
      } catch (error) {
        console.error("Erreur lors de la suppression de l'offre:", error);
        Swal.fire('Erreur', "Échec de la suppression de l'offre", 'error');
      }
    }
  };

  return (
    <div className="offre-admin-container">
      <button onClick={handleOpenModal} className="add-offre-button">
        Ajouter Offre
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
      </div>
      <div className="offre-cards-container">
        {offres.map((offre, index) => (
          <div key={index} className="offre-card">
            <h2>{offre.titre}</h2>
            <p>{offre.description}</p>
            <p>Date de début: {offre.date_debut}</p>
            <p>Date de fin: {offre.date_fin}</p>
            <img src={`http://localhost:5000/${offre.lesImages[offre.currentImageIndex]?.image}`} alt={`Image ${offre.currentImageIndex}`} />
            <p>Prix: {offre.prix}</p>
            
            <button onClick={() => handleUpdate(offre.id_offre)}>
              Modifier
            </button>
            <button onClick={() => handleDelete(offre.id_offre)}>
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OffreAdmin;
