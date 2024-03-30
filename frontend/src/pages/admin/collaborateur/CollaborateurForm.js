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
          `http://localhost:5000/collaborator/${collaborateurId}`,
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
        'http://localhost:5000/upload-image', // Update URL as per your backend
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

    try {
      let response;
      if (isUpdate) {
        // Handle update logic using collaborateurId prop
        response = await axios.put(
          `http://localhost:5000/collaborator/${collaborateurId}`,
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
          'http://localhost:5000/collaborator',
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
    <form className="collaborateur-container" onSubmit={handleSubmit}>
      <label className="collaborateur-label">
        Nom:
        <input
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="collaborateur-input"
          required
        />
      </label>
      <label className="collaborateur-label">
        Catégorie:
        <input
          type="text"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="collaborateur-input"
          required
        />
      </label>
      <label className="collaborateur-label">
        Adresse:
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
          className="collaborateur-input"
          required
        />
      </label>
      <label className="collaborateur-label">
        Téléphone:
        <input
          type="text"
          value={tel}
          onChange={(e) => setTel(e.target.value)}
          className="collaborateur-input"
          required
        />
      </label>
      <label className="collaborateur-label">
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="collaborateur-input"
          required
        />
      </label>
      <label className="collaborateur-label">
        Site Web:
        <input
          type="text"
          value={siteWeb}
          onChange={(e) => setSiteWeb(e.target.value)}
          className="collaborateur-input"
        />
      </label>
      <label className="collaborateur-label">
        Logo:
        <div>
          <input
            type="text"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            className="collaborateur-input"
            disabled // Disable manual input for the logo URL
          />
          <button type="button" onClick={() => document.getElementById('fileInput').click()}>
            Upload Logo
          </button>
          <input
            id="fileInput"
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => handleImageUpload(e.target.files[0])}
          />
        </div>
      </label>
      <button type="submit" className="form-collab-button">
        {isUpdate ? 'Modifier Collaborateur' : 'Ajouter Collaborateur'}
      </button>
    </form>
  );
}

export default CollaborateurForm;
