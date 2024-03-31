import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function OffreForm({ onRequestClose, onSuccess, isUpdate, offreId }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState(0);
  const [date_debut, setDateDebut] = useState('');
  const [date_fin, setDateFin] = useState('');
  const [photo, setPhoto] = useState('');
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [selectedCollaborateur, setSelectedCollaborateur] = useState('');

  const token = localStorage.getItem('login');

  useEffect(() => {
    const fetchOffre = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/offer/${offreId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
        const {
          titre,
          description,
          prix,
          date_debut,
          date_fin,
          photo,
          id_collaborateur,
        } = response.data;
        setTitre(titre);
        setDescription(description);
        setPrix(prix);
        setDateDebut(date_debut);
        setDateFin(date_fin);
        setPhoto(photo);
        setSelectedCollaborateur(id_collaborateur); // Set the selected collaborateur ID
      } catch (error) {
        console.error('Error fetching offre data:', error);
      }
    };

    if (isUpdate) {
      fetchOffre();
    }

    // Fetch collaborateurs for the dropdown list
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
        console.error('Error fetching collaborateurs:', error);
      }
    };

    fetchCollaborateurs();
  }, [isUpdate, offreId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const offreData = {
      titre,
      description,
      prix,
      date_debut,
      date_fin,
      photo,
      id_collaborateur: selectedCollaborateur,
    };

    try {
      let response;
      if (isUpdate) {
        response = await axios.put(
          `http://localhost:5000/offer/${offreId}`,
          offreData,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(token).token}`,
            },
          }
        );
      } else {
        response = await axios.post('http://localhost:5000/offer', offreData, {
          headers: {
            Authorization: `Bearer ${JSON.parse(token).token}`,
          },
        });
      }

      console.log(response.data.message); // Confirmation message
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: isUpdate
          ? "L'offre a été mise à jour avec succès."
          : "L'offre a été ajoutée avec succès.",
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
        } de l'offre.`,
      });
    }
  };

  return (
    <form className="offre-form-container" onSubmit={handleSubmit}>
      <label>
        Titre:
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
      </label>
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Prix:
        <input
          type="number"
          value={prix}
          onChange={(e) => setPrix(parseFloat(e.target.value))}
          required
        />
      </label>
      <label>
        Date de début:
        <input
          type="date"
          value={date_debut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
        />
      </label>
      <label>
        Date de fin:
        <input
          type="date"
          value={date_fin}
          onChange={(e) => setDateFin(e.target.value)}
          required
        />
      </label>
      <label>
        Photo:
        <input
          type="text"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          required
        />
      </label>
      <label>
        Collaborateur:
        <select
          value={selectedCollaborateur}
          onChange={(e) => setSelectedCollaborateur(e.target.value)}
          required
        >
          <option value="">Sélectionnez un collaborateur</option>
          {collaborateurs.map((collaborateur) => (
            <option
              key={collaborateur.id_collaborateur}
              value={collaborateur.id_collaborateur}
            >
              {collaborateur.nom}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">
        {isUpdate ? 'Modifier Offre' : 'Ajouter Offre'}
      </button>
    </form>
  );
}

export default OffreForm;
