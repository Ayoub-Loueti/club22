import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OffreAdmin.css';
import UpdateOffreModal from './UpdateOffreModal';
import AddOffreModal from './AddOffreModal';

function OffreCollab({ collaborateurId }) {
  const [offres, setOffres] = useState([]);
  const [selectedOffreId, setSelectedOffreId] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const token = localStorage.getItem('login');
  const [offreAddedOrUpdated, setOffreAddedOrUpdated] = useState(false);

  useEffect(() => {
    fetchOffres();
  }, [collaborateurId, offreAddedOrUpdated]);

  const fetchOffres = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/allOffersCollab/${collaborateurId}`, {
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOffres((prevOffres) =>
        prevOffres.map((offre) => ({
          ...offre,
          currentImageIndex: (offre.currentImageIndex + 1) % offre.lesImages.length,
        }))
      );
    }, 5000);
    return () => clearInterval(intervalId);
  }, [offres]);

  const handleDelete = async (offreId) => {
    const confirmation = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirmation.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/offer/${offreId}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
        setOffreAddedOrUpdated(prev => !prev);
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      } catch (error) {
        console.error("Error deleting offre:", error);
        Swal.fire('Error!', 'There was an issue deleting the offre.', 'error');
      }
    }
  };

  const handleUpdateClick = (offreId) => {
    setSelectedOffreId(offreId);
    setIsUpdateModalOpen(true);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsUpdateModalOpen(false);
    setIsAddModalOpen(false);
    setOffreAddedOrUpdated(prev => !prev);
  };

  return (
    <div className="offre-admin-container">
      <button onClick={handleAddClick} className="add-offre-button">
        Add Offre
      </button>
      <div className="offre-cards-container">
        {offres.map((offre, index) => (
          <div key={index} className="offre-card">
          <h3>{offre.titre}</h3>
          <p>{offre.description}</p>
          <p>Date de début: {offre.date_debut}</p>
          <p>Date de fin: {offre.date_fin}</p>
          <img src={`http://localhost:5000/${offre.lesImages[offre.currentImageIndex]?.image}`} alt="Offre Image" />
          <p>Prix: {offre.prix}</p>
          <div className="offre-card-actions">
            <button className="offre-card-button" onClick={() => handleUpdateClick(offre.id_offre)}>Update</button>
            <button className="offre-card-button" onClick={() => handleDelete(offre.id_offre)}>Delete</button>
          </div>
        </div>
        ))}
      </div>
      {isUpdateModalOpen && (
        <UpdateOffreModal
          isOpen={isUpdateModalOpen}
          offreId={selectedOffreId}
          onRequestClose={handleModalClose}
          onSuccess={handleModalClose}
        />
      )}
      {isAddModalOpen && (
        <AddOffreModal
          isOpen={isAddModalOpen}
          onRequestClose={handleModalClose}
          onSuccess={handleModalClose}
        />
      )}
    </div>
  );
}

export default OffreCollab;
