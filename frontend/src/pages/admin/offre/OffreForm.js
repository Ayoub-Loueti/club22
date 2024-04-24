import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OffreForm.css';

function OffreForm({ onRequestClose, onSuccess, isUpdate, offreId }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState(0);
  const [date_debut, setDateDebut] = useState('');
  const [date_fin, setDateFin] = useState('');
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [type, setType] = useState(''); // Corrected: Initialize as a scalar
const [remise, setRemise] = useState('');

  const [selectedCollaborateur, setSelectedCollaborateur] = useState('');
  const [images, setImages] = useState([]);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const token = localStorage.getItem('login');
  useEffect(() => {
    const headers = { Authorization: `Bearer ${JSON.parse(token).token}` };

    if (isUpdate) {
      axios
        .get(`http://localhost:5000/offer/${offreId}`, { headers })
        .then((response) => {
          const {
            titre,
            description,
            prix,
            date_debut,
            date_fin,
            id_collaborateur,
            type,
            remise
          } = response.data;
          setTitre(titre);
          setDescription(description);
          setPrix(prix);
          setDateDebut(date_debut.split('T')[0]);
          setDateFin(date_fin.split('T')[0]);
          setSelectedCollaborateur(id_collaborateur);
          setType(type);  
          setRemise(remise ? remise.toString().padStart(2, '0') : ''); 

          setInitialDataLoaded(true);
        })
        .catch((error) => console.error('Error fetching offer data:', error));
    }

    axios
      .get('http://localhost:5000/allCollaborators', { headers })
      .then((response) => {
        setCollaborateurs(response.data);
      })
      .catch((error) => console.error('Error fetching collaborators:', error));
  }, [isUpdate, offreId, token]);
  
 const handleImageChange = (e) => {
   const files = Array.from(e.target.files);
   if (files.length > 4) {
     Swal.fire(
       'Attention',
       'Seules les 4 premières photos seront prises en compte.',
       'warning'
     );
     files.splice(4); // Limit to first 4 files
   }
   setImages(files);
 };


  const handleSubmit = async (e) => {
  e.preventDefault();
  if (parseInt(remise, 10) < 1 || parseInt(remise, 10) > 100) {
    Swal.fire(
      'Remise invalide',
      'Veuillez saisir une remise entre 1 et 100.',
      'error'
    );
    return;
  }
   const formData = new FormData();
   formData.append('titre', titre);
   formData.append('description', description);
   formData.append('prix', prix);
   formData.append('date_debut', date_debut);
   formData.append('date_fin', date_fin);
   formData.append('id_collaborateur', selectedCollaborateur);
   formData.append('type', document.getElementById('type').value);
  formData.append('remise', remise === '' ? 0 : parseInt(remise, 10));
   images.forEach((image, index) => {
     formData.append('photos', image, image.name || `image_${index}.jpg`);
   });

   try {
     const config = {
       headers: {
         'Content-Type': 'multipart/form-data',
         Authorization: `Bearer ${JSON.parse(token).token}`,
       },
     };
     const url = isUpdate
       ? `http://localhost:5000/offer/${offreId}`
       : 'http://localhost:5000/offer';
     const method = isUpdate ? 'put' : 'post';

     const response = await axios[method](url, formData, config);

     Swal.fire(
       'Succès',
       `L'offre a été ${isUpdate ? 'mise à jour' : 'ajoutée'} avec succès.`,
       'success'
     );
     onSuccess();
     onRequestClose();
   } catch (error) {
     console.error('Erreur:', error);
     Swal.fire(
       'Erreur',
       `Une erreur s'est produite lors de la ${
         isUpdate ? 'mise à jour' : "l'ajout"
       } de l'offre.`,
       'error'
     );
   }
 };
const handleRemiseChange = (e) => {
  let value = parseInt(e.target.value, 10);
  if (isNaN(value) || value < 1 || value > 100) {
    setRemise('');
  } else {
    setRemise(value.toString().padStart(2, '0'));
  }
};

const today = new Date().toISOString().split('T')[0]; 
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
      <div>
        <label htmlFor="type">Catégorie :</label>
        <select
          id="type"
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="voyage">Voyage</option>
          <option value="hotel">Hotel</option>
          <option value="activité">Activité</option>
          <option value="autre">Autre</option>
        </select>
      </div>

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
          onChange={(e) => setPrix(Math.max(0, parseFloat(e.target.value)))}
          min="0"
          required
        />
        <label>
          Remise (Entre 1% et 100%):
          <input
            type="text" // Use text type to maintain zero padding
            value={remise}
            onChange={handleRemiseChange}
            maxLength="3" // Limit length to 3 to avoid over 100
          />
        </label>
      </label>
      <label>
        Date de début:
        <input
          type="date"
          value={date_debut}
          onChange={(e) => setDateDebut(e.target.value)}
          min={isUpdate && initialDataLoaded ? undefined : today}
          required
        />
      </label>
      <label>
        Date de fin:
        <input
          type="date"
          value={date_fin}
          onChange={(e) => setDateFin(e.target.value)}
          min={date_debut || today}
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
      <label>
        Images:
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required={!isUpdate || !initialDataLoaded}
        />
      </label>
      <div className="formBut">
        <button type="button" className="cancelBut" onClick={onRequestClose}>
          Annuler
        </button>
        <button type="submit" className="subButton">
          {isUpdate ? 'Modifier ' : 'Ajouter '}
        </button>
      </div>
    </form>
  );
}

export default OffreForm;
