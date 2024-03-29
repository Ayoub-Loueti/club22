import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './listCollaborateur.css';
import UpdateCollaborateurModal from './UpdateCollaborateur/UpdateCollaborateurModal'; // Import de la modal pour la mise à jour
import AddCollaborateurModal from './AddCollaborateur/AddCollaborateurModal';

function ListCollaborateur() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // État pour contrôler l'ouverture de la modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control the modal opening
  const [collaboratorAddedOrUpdated, setCollaboratorAddedOrUpdated] =
    useState(false); // New state

  const navigate = useNavigate();
  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchCollaborateurs = async () => {
      try {
        const response = await axios.get(
          'http://localhost:5000/allCollaborators',
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        setCollaborateurs(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (token) {
      fetchCollaborateurs();
    }
  }, [token, collaboratorAddedOrUpdated]);

  const filteredCollaborateurs = collaborateurs.filter(
    (collaborateur) =>
      collaborateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborateur.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborateur.adresse.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborateur.tel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborateur.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collaborateur.siteWeb.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (collaboratorId) => {
    // Afficher une boîte de dialogue de confirmation
    Swal.fire({
      title: 'Êtes-vous sûr(e) de vouloir supprimer ce collaborateur ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      reverseButtons: true, // Inverser le bouton de confirmation et le bouton d'annulation
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/collaborator/${collaboratorId}`,
            {
              headers: {
                Authorization: `Bearer ${JSON.parse(token).token}`,
              },
            }
          );
          console.log(response.data.message); // Message de confirmation de suppression
          // Mettre à jour la liste après suppression
          setCollaborateurs(
            collaborateurs.filter(
              (collab) => collab.id_collaborateur !== collaboratorId
            )
          );
          // Afficher une alerte de succès
          Swal.fire({
            icon: 'success',
            title: 'Succès',
            text: 'Le collaborateur a été supprimé avec succès.',
          });
        } catch (error) {
          console.error('Error deleting collaborator:', error);
          // Afficher une alerte d'erreur
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la suppression du collaborateur.',
          });
        }
      }
    });
  };

  const handleUpdate = (collaboratorId) => {
    // Ouvrir la modal de mise à jour avec le collaborateur sélectionné
    setSelectedCollaborateur(
      collaborateurs.find((collab) => collab.id === collaboratorId)
    );
    setIsUpdateModalOpen(true); // Ouvrir la modal
  };

  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleAddOrUpdateSuccess = () => {
    setCollaboratorAddedOrUpdated(true); // Trigger re-render after adding or updating a collaborator
  };
  return (
    <div className="listCollaborateur-container">
      <button onClick={handleOpenModal}>Ajouter Collaborateur</button>
      <AddCollaborateurModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSuccess={handleAddOrUpdateSuccess}
      />
      <div className="listCollaborateur-header">
        <h1>Liste des Collaborateurs</h1>
        <input
          type="text"
          className="listCollaborateur-search-input"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="listCollaborateur-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Type</th>
            <th>Adresse</th>
            <th>Tel</th>
            <th>Email</th>
            <th>Site Web</th>
            <th>Logo</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredCollaborateurs.map((collaborateur, index) => (
            <tr key={index}>
              <td>{collaborateur.id_collaborateur}</td>
              <td>{collaborateur.nom}</td>
              <td>{collaborateur.type}</td>
              <td>{collaborateur.adresse}</td>
              <td>{collaborateur.tel}</td>
              <td>{collaborateur.email}</td>
              <td>{collaborateur.siteWeb}</td>
              <td>{collaborateur.logo}</td>
              <td>
                <button onClick={() => handleUpdate(collaborateur.id)}>
                  Modifier
                </button>
                <button onClick={() => handleDelete(collaborateur.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListCollaborateur;
