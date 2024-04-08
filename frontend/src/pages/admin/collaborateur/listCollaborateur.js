import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './listCollaborateur.css';
import UpdateCollaborateurModal from './UpdateCollaborateurModal';
import AddCollaborateurModal from './AddCollaborateurModal';
import { FaArrowLeft } from 'react-icons/fa';

function ListCollaborateur() {
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollaborateur, setSelectedCollaborateur] = useState(null);
  const [selectedCollaborateurId, setSelectedCollaborateurId] = useState(null);
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
          'http://localhost:5000/allCollaborateursAD',
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

  const filteredCollaborateurs = collaborateurs.filter((collaborateur) => {
    const nom = collaborateur.nom ? collaborateur.nom.toLowerCase() : ''; // Check if nom is not null
    const type = collaborateur.type ? collaborateur.type.toLowerCase() : ''; // Check if type is not null
    const adresse = collaborateur.adresse
      ? collaborateur.adresse.toLowerCase()
      : ''; // Check if adresse is not null
    const tel = collaborateur.tel ? collaborateur.tel.toLowerCase() : ''; // Check if tel is not null
    const email = collaborateur.email ? collaborateur.email.toLowerCase() : ''; // Check if email is not null
    const siteWeb = collaborateur.siteWeb
      ? collaborateur.siteWeb.toLowerCase()
      : ''; // Check if siteWeb is not null

    return (
      nom.includes(searchTerm.toLowerCase()) ||
      type.includes(searchTerm.toLowerCase()) ||
      adresse.includes(searchTerm.toLowerCase()) ||
      tel.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      siteWeb.includes(searchTerm.toLowerCase())
    );
  });

  const handleUpdate = (collaborateurId) => {
    setSelectedCollaborateurId(collaborateurId);
    setIsUpdateModalOpen(true);
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
    setCollaboratorAddedOrUpdated((prev) => !prev); // Inverser la valeur actuelle de l'état
  };
  const handleArchive = async (collabId) => {
    try {
      await axios.put(
        `http://localhost:5000/collaborateur/${collabId}/archiver`,
        null, // Empty data since it's a PUT request
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      setCollaboratorAddedOrUpdated(!collaboratorAddedOrUpdated);
      Swal.fire('Success', 'Collaborateur archivé avec succès', 'success');
    } catch (error) {
      console.error('Error archiving collaborator:', error);
      Swal.fire('Error', 'Failed to archive collaborateur', 'error');
    }
  };

  const handleUnarchive = async (collabId) => {
    try {
      await axios.put(
        `http://localhost:5000/collaborateur/${collabId}/desarchiver`,
        null, // Empty data since it's a PUT request
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );
      setCollaboratorAddedOrUpdated(!collaboratorAddedOrUpdated);
      Swal.fire('Success', 'Collaborateur désarchivé avec succès', 'success');
    } catch (error) {
      console.error('Error unarchiving collaborator:', error);
      Swal.fire('Error', 'Failed to unarchive collaborateur', 'error');
    }
  };

  return (
    <div className="listCollaborateur-container">
      <button className="retour-btn" onClick={() => window.history.back()}>
        <FaArrowLeft /> Retour
      </button>
      <button onClick={handleOpenModal} className="list-collab-button">
        Ajouter Collaborateur
      </button>
      <AddCollaborateurModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        onSuccess={handleAddOrUpdateSuccess}
      />
      <div className="listCollaborateur-header">
        <h1 className="listCollaborateur-title">LISTE DES COLLABORATEURS</h1>
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
            <th>Collaborateur</th>
            <th>Catégorie</th>
            <th>Adresse</th>
            <th>Télephone</th>
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
              <td>
                <img
                  src={
                    collaborateur.logo
                      ? `http://localhost:5000/${collaborateur.logo}`
                      : 'https://png.pngtree.com/png-vector/20220119/ourmid/pngtree-crossed-image-icon-picture-not-available-sign-photo-sign-icon-vector-png-image_44027862.jpg'
                  }
                  alt={collaborateur.nom}
                  className="collaborateur-picturee"
                />
              </td>
              <td>
                <button
                  onClick={() => handleUpdate(collaborateur.id_collaborateur)}
                  className="list-collab-button"
                >
                  Modifier
                </button>
                {collaborateur.archiver ? (
                  <button
                    onClick={() =>
                      handleUnarchive(collaborateur.id_collaborateur)
                    }
                    className="list-collab-button"
                  >
                    Désarchiver
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleArchive(collaborateur.id_collaborateur)
                    }
                    className="list-collab-button"
                  >
                    Archiver
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UpdateCollaborateurModal
        isOpen={isUpdateModalOpen}
        onRequestClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleAddOrUpdateSuccess}
        collaborateurId={selectedCollaborateurId}
      />
    </div>
  );
}

export default ListCollaborateur;
