import React, { useState, useEffect, useRef} from 'react';
import axios from 'axios';
import '../assets/profil.css';
import { FaEdit } from 'react-icons/fa';
import '../components/navbar';
import Navbar from '../components/navbar';
import NavbarHaut from '../components/navbarHaut';
function Profil() {
  const token = localStorage.getItem('login');
  const [utilisateur, setUtilisateur] = useState([]);
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

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/profil', {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          });
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
        }
      }
    };
    fetchUserData();
  }, [token]);

 const handleEditChange = (e) => {
   const { name, value } = e.target;

   if (name === 'description' && value.length > 50) return;

   // Limite la longueur du nom et du prénom à 11 caractères
   if ((name === 'nom' || name === 'prenom') && value.length > 15) return;

   setEditValues({ ...editValues, [name]: value });
 };


  const toggleEdit = (field) => {
    setEditing({ ...editing, [field]: !editing[field] });
  };

const handleUpdate = async (field) => {
  // Vérifie et applique la limite de caractères avant de procéder à la mise à jour
  if (field === 'description' && editValues[field].length > 50) {
    console.error('La description ne peut pas dépasser 30 caractères');
    return;
  }

  if (
    (field === 'nom' || field === 'prenom') &&
    editValues[field].length > 15
  ) {
    console.error('Le nom et le prénom ne peuvent pas dépasser 11 caractères');
    return;
  }

  try {
    await axios.put(
      'http://localhost:5000/updateCompte',
      { [field]: editValues[field] },
      { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
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
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        }
      );

      if (response.status === 200) {
        // If the upload is successful, reload the page to reflect the changes
        window.location.reload();
      } else {
        // Handle any errors or unsuccessful upload attempts here
        console.error('Failed to upload the image');
      }
    } catch (error) {
      console.error('Error during the image upload', error);
    }
  };

  return (
    <>
      <Navbar />
      <NavbarHaut />
      <div className="profile-container">
        <div className="profile-header">
          <img
            src={
              utilisateur.photo
                ? `http://localhost:5000/${utilisateur.photo}`
                : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
            }
            alt="Profil"
            className="profile-picturee"
          />
          <FaEdit
            className="edit-profile-picture-icon"
            onClick={() => fileInputRef.current.click()}
          />
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <h1>{`${utilisateur.prenom} ${utilisateur.nom} `}</h1>
        </div>

        <div className="profile-bio">
          <h2>Description</h2>
          {editing.description ? (
            <textarea
              name="description"
              value={editValues.description}
              onChange={handleEditChange}
              onBlur={() => handleUpdate('description')}
              className="edit-input-desc"
            />
          ) : (
            <p onClick={() => toggleEdit('description')}>
              {utilisateur.description}
            </p>
          )}
          <FaEdit
            onClick={() => toggleEdit('description')}
            className="edit-icon-desc"
          />
        </div>
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{utilisateur.email}</span>
          </div>
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
            <FaEdit onClick={() => toggleEdit('nom')} className="edit-icon" />
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
            <FaEdit
              onClick={() => toggleEdit('prenom')}
              className="edit-icon"
            />
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
            <FaEdit onClick={() => toggleEdit('genre')} className="edit-icon" />
          </div>

          <div className="info-item">
            <span className="info-label">Vous êtes:</span>
            <span className="info-value">{utilisateur.type}</span>
          </div>
          {/* Ajoutez d'autres informations ici */}
        </div>
        {/* Ajout d'un séparateur */}
        <div className="separator"></div>
      </div>
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