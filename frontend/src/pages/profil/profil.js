import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaBookmark, FaTrash } from 'react-icons/fa';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import './profil.css';

import PostProfile from '../../components/postProfil/postProfil';
import PostSavedModal from '../../components/PostSavedModal/PostSavedModal'; // Adjust the import path as needed
import ScrollToTop from '../../components/designs/ScrollToTop';

function Profil() {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  // Assuming 'login' is a JSON string that contains the token
  const storedData = JSON.parse(localStorage.getItem('login'));
  const token = storedData?.token; // Retrieve the token without JSON.parse on the token itself
  const userId = JSON.parse(localStorage.getItem('userId')); // Assuming 'userId' is stored directly
  const isOwnProfile = userId?.toString() === id; // Safely check for equality
  const [modalOpened, setModalOpened] = useState(false); // State to control the modal
  const [utilisateur, setUtilisateur] = useState({});
  const [editing, setEditing] = useState({
    nom: false,
    prenom: false,
    genre: false,
    description: false,
  });
  const [editValues, setEditValues] = useState({
    nom: '',
    prenom: '',
    genre: '',
    description: '',
  });

  const fileInputRef = useRef(null);
const [showDropdown, setShowDropdown] = useState(false);
const dropdownRef = useRef(null);



  useEffect(() => {
    const fetchUserData = async () => {
      if (token && id) {
        try {
          const response = await axios.get(
            `http://localhost:5000/profil/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Use token directly
              },
            }
          );
          setUtilisateur(response.data.user);
          setEditValues({
            nom: response.data.user.nom,
            prenom: response.data.user.prenom,
            genre: response.data.user.genre,
            description: response.data.user.description,
          });
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur",
            error
          );
          Swal.fire(
            'Erreur',
            'Impossible de récupérer les données de l’utilisateur.',
            'error'
          );
        }
      }
    };
    fetchUserData();
  }, [token, id]); // Dependency array

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === 'description' && value.length > 50) return;
    if ((name === 'nom' || name === 'prenom') && value.length > 15) return;

    setEditValues({ ...editValues, [name]: value });
  };

  const toggleEdit = (field) => {
    setEditing({ ...editing, [field]: !editing[field] });
  };

  const handleUpdate = async (field) => {
    if (field === 'description' && editValues[field].length > 50) {
      console.error('La description ne peut pas dépasser 30 caractères');
      return;
    }
    if (
      (field === 'nom' || field === 'prenom') &&
      editValues[field].length > 15
    ) {
      console.error(
        'Le nom et le prénom ne peuvent pas dépasser 11 caractères'
      );
      return;
    }
    try {
      await axios.put(
        'http://localhost:5000/updateCompte',
        { [field]: editValues[field] },
        { headers: { Authorization: `Bearer ${token}` } } // Corrected usage of token
      );
      setUtilisateur({ ...utilisateur, [field]: editValues[field] });
      toggleEdit(field);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('photo', file);
    try {
      const response = await axios.post(
        'http://localhost:5000/updateProfilePicture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`, // Corrected usage of token
          },
        }
      );
      if (response.status === 200) {
        window.location.reload(); // Reload the page to reflect the changes
      } else {
        console.error('Failed to upload the image');
      }
    } catch (error) {
      console.error('Error during the image upload', error);
    }
  };
  const handleDeleteProfilePicture = async () => {
    // Show confirmation dialog
    Swal.fire({
      title: 'Êtes-vous sûr(e) ?',
      text: 'Vous ne pourrez pas revenir en arrière !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer !',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed the deletion
        deleteProfilePicture(); // Proceed with the deletion
      }
    });
  };

  const deleteProfilePicture = async () => {
    try {
      const response = await axios.delete(
        'http://localhost:5000/profile-picture',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        // Afficher un message de succès avant de recharger la page
        Swal.fire({
          title: 'Supprimée !',
          text: 'Votre photo de profil a été supprimée.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload(); // Recharge la page pour refléter les changements
          }
        });
      }
    } catch (error) {
      console.error(
        'Erreur lors de la suppression de la photo de profil :',
        error
      );
      // Afficher un message d'erreur
      Swal.fire(
        'Erreur !',
        "Votre photo de profil n'a pas pu être supprimée. Veuillez réessayer plus tard.",
        'error'
      );
    }
  };
const toggleDropdown = () => {
  setShowDropdown(!showDropdown);
};
function useOutsideClick(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}
useOutsideClick(dropdownRef, () => {
  if (showDropdown) setShowDropdown(false);
});

  return (
    <>
      <Navbar />
      <NavbarHaut />
      <ScrollToTop />

      <PostSavedModal
        modalOpened={modalOpened}
        setModalOpened={setModalOpened}
      />
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-picture-options">
            <img
              src={
                utilisateur.photo
                  ? `http://localhost:5000/${utilisateur.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="Profil"
              className="profile-picturee"
            />
            {isOwnProfile && (
              <>
                <button
                  onClick={toggleDropdown}
                  className="dropdown-toggle-btn"
                >
                  ⋮
                </button>{' '}
                {/* This is the button to toggle the dropdown */}
                {showDropdown && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <div onClick={() => fileInputRef.current.click()}>
                      {' '}
                      📸 Changer photo
                    </div>
                    <div onClick={handleDeleteProfilePicture}>
                      🗑️ Supprimer photo
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
              </>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />

            <h1>{`${utilisateur.prenom} ${utilisateur.nom} `}</h1>
          </div>{' '}
        </div>

        {isOwnProfile && (
          <div className="view-saved-posts-container">
            <button
              className="open-saved-posts-btn"
              onClick={() => setModalOpened(true)}
            >
              <FaBookmark className="saved-posts-icon" />
              <span>ENREGISTREMENTS</span>
            </button>
          </div>
        )}
        <div className="profile-bio">
          <h2>Description</h2>
          {editing.description && isOwnProfile ? (
            <textarea
              name="description"
              value={editValues.description}
              onChange={handleEditChange}
              onBlur={() => handleUpdate('description')}
              className="edit-input-desc"
            />
          ) : (
            <p onClick={() => isOwnProfile && toggleEdit('description')}>
              {utilisateur.description ||
                'Profil en cours de personnalisation!'}
            </p>
          )}
          {isOwnProfile && (
            <span
              onClick={() => toggleEdit('description')}
              className="edit-icon-desc"
            >
              📝
            </span>
          )}
        </div>
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{utilisateur.email}</span>
          </div>
          <div className="capital">
            <div className="info-item">
              <span className="info-label">Nom:</span>
              {editing.nom ? (
                <input
                  type="text"
                  name="nom"
                  value={editValues.nom}
                  onChange={handleEditChange}
                  onBlur={() => handleUpdate('nom')}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{utilisateur.nom}</span>
              )}
              {isOwnProfile && (
                <span onClick={() => toggleEdit('nom')} className="edit-icon">
                  🖊️
                </span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Prénom:</span>
              {editing.prenom ? (
                <input
                  type="text"
                  name="prenom"
                  value={editValues.prenom}
                  onChange={handleEditChange}
                  onBlur={() => handleUpdate('prenom')}
                  className="edit-input"
                />
              ) : (
                <span className="info-value">{utilisateur.prenom}</span>
              )}
              {isOwnProfile && (
                <span
                  onClick={() => toggleEdit('prenom')}
                  className="edit-icon"
                >
                  🖊️
                </span>
              )}
            </div>
            <div className="info-item">
              <span className="info-label">Genre:</span>
              {editing.genre ? (
                <select
                  name="genre"
                  value={editValues.genre}
                  onChange={handleEditChange}
                  onBlur={() => handleUpdate('genre')}
                  className="edit-input"
                >
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              ) : (
                <span className="info-value">{utilisateur.genre}</span>
              )}
              {isOwnProfile && (
                <span onClick={() => toggleEdit('genre')} className="edit-icon">
                  🖊️
                </span>
              )}
            </div>

            <div className="info-item">
              <span className="info-label">Rôle:</span>
              <span className="info-value">{utilisateur.type}</span>
            </div>
          </div>
          {/* Ajoutez d'autres informations ici */}
        </div>
        {/* Ajout d'un séparateur */}
        <div className="separator"></div>
      </div>
      <PostProfile />
    </>
  );
}

export default Profil;
/*
<div className="profile-stats">
          <div className="stat">
            <h3>Followers</h3>
            <p>1000</p>
          </div>
          <div className="stat">
            <h3>Following</h3>
            <p>500</p>
          </div>
          <div className="stat">
            <h3>Posts</h3>
            <p>500</p>
          </div>
        </div> 
*/
