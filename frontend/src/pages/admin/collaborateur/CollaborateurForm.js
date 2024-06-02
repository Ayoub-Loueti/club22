import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './CollaborateurForm.css';

function CollaborateurForm({
  onRequestClose,
  onSuccess,
  isUpdate,
  collaborateurId,
}) {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('');
  const [tel, setTel] = useState('');
  const [siteWeb, setSiteWeb] = useState('');
  const [logo, setLogo] = useState('');

  const token = localStorage.getItem('login');

  useEffect(() => {
    // Fetch collaborator data if in update mode
    const fetchCollaborateur = async () => {
      try {
        const response = await axios.get(
          `http://3.88.157.0/collaborator/${collaborateurId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        const { nom, adresse, email, type, tel, siteWeb, logo } = response.data;
        setNom(nom);
        setAdresse(adresse);
        setEmail(email);
        setType(type);
        setTel(tel);
        setSiteWeb(siteWeb);
        setLogo(logo);
      } catch (error) {
        console.error('Error fetching collaborator data:', error);
      }
    };

    if (isUpdate) {
      fetchCollaborateur();
    }
  }, [isUpdate, collaborateurId, token]);

  const handleImageUpload = async (file) => {
    const data = new FormData();
    data.append('file', file);

    try {
      const response = await axios.post(
        'http://3.88.157.0/upload-image', // Update URL as per your backend
        data
      );
      const imageUrl = response.data.imageUrl;

      setLogo(imageUrl); // Update the state with the uploaded image URL
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const collaborateurData = { nom, type, adresse, tel, email, siteWeb, logo };
    if (!/^\d+$/.test(tel)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Le numéro de téléphone doit être numérique.',
      });
      return; // Ne pas soumettre le formulaire si la validation échoue
    }
    try {
      let response;
      if (isUpdate) {
        // Handle update logic using collaborateurId prop
        response = await axios.put(
          `http://3.88.157.0/collaborator/${collaborateurId}`,
          collaborateurData,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
      } else {
        // Handle add logic
        response = await axios.post(
          'http://3.88.157.0/collaborator',
          collaborateurData,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
      }

      console.log(response.data.message); // Confirmation message
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: isUpdate
          ? 'Le collaborateur a été mis à jour avec succès.'
          : 'Le collaborateur a été ajouté avec succès.',
      });
      onSuccess();
      onRequestClose(); // Close the modal after adding/updating
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `Une erreur est survenue lors de ${
          isUpdate ? 'la mise à jour' : "l'ajout"
        } du collaborateur.`,
      });
    }
  };

  return (
    <form className="offre-form-container" onSubmit={handleSubmit}>
      <label>
        Nom:
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="collab-form-input"
          required
        />
      </label>
      <label>
        Catégorie:
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="collab-form-input"
          required
        />
      </label>
      <label>
        Adresse:
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="collab-form-input"
          required
        />
      </label>
      <label>
        Téléphone:
        <input
          type="tel"
          value={tel}
          pattern="[0-9]*"
          onChange={(e) => setTel(e.target.value)}
          onInvalid={(e) =>
            e.target.setCustomValidity(
              'Le numéro de téléphone doit être numérique.'
            )
          }
          onInput={(e) => e.target.setCustomValidity('')}
          className="collab-form-input"
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="collab-form-input"
          required
        />
      </label>
      <label>
        Site Web:
        <input
          type="text"
          value={siteWeb}
          onChange={(e) => setSiteWeb(e.target.value)}
          className="collab-form-input"
        />
      </label>
      <label>
        Logo:
        <div className="upload-btn-wrapper">
          <button
            type="button"
            className="btn"
            onClick={() => document.getElementById('fileInput').click()}
          >
            Importer Logo
          </button>
          <input
            id="fileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => handleImageUpload(e.target.files[0])}
            className="collab-form-input"
          />
        </div>{' '}
      </label>
      <div className="formBcont">
        <button
          type="button"
          className="collabCButton"
          onClick={onRequestClose}
        >
          Annuler
        </button>
        <button type="submit" className="collabFButton">
          {isUpdate ? 'MODIFIER' : 'AJOUTER '}
        </button>
      </div>
    </form>
  );
}

export default CollaborateurForm;
