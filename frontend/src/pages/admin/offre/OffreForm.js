import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './OffreForm.css';
import { Editor } from '@tinymce/tinymce-react';
import LocationSearchInput from './map/LocationSearchInput';

function OffreForm({ onRequestClose, onSuccess, isUpdate, offreId }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState(0);
  const [date_debut, setDateDebut] = useState('');
  const [date_fin, setDateFin] = useState('');
  const [collaborateurs, setCollaborateurs] = useState([]);
  const [typeOffre, setTypeOffre] = useState('');
  const [remise, setRemise] = useState('');
    const [destination, setDestination] = useState('');

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const [selectedCollaborateur, setSelectedCollaborateur] = useState('');
  const [images, setImages] = useState([]);

  // States for Voyage-specific fields
const [programme, setProgramme] = useState(''); 
  const [inclus, setInclus] = useState('');
  const [nbr_jours, setNbrJours] = useState(0);

  // States for Hotel-specific fields
  const [hotelName, setHotelName] = useState('');
  const [etoiles, setEtoiles] = useState(0);
  const [climatisation, setClimatisation] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [piscineExterieure, setPiscineExterieure] = useState(false);
  const [piscineCouverte, setPiscineCouverte] = useState(false);
  const [bassinEnfants, setBassinEnfants] = useState(false);
  const [parking, setParking] = useState(false);
  const [discotheque, setDiscotheque] = useState(false);
  const [plagePrivee, setPlagePrivee] = useState(false);
  const [ascenseur, setAscenseur] = useState(false);
  const [salleDeSport, setSalleDeSport] = useState(false);
  const [aireDeJeuxEnfants, setAireDeJeuxEnfants] = useState(false);

  // States for Activité-specific fields

  const [duree, setDuree] = useState(0);

  const token = localStorage.getItem('login');
  useEffect(() => {
    const headers = { Authorization: `Bearer ${JSON.parse(token).token}` };

    if (isUpdate) {
      axios
        .get(`http://localhost:5000/offer/${offreId}`, { headers })
        .then((response) => {
          const data = response.data;
          setTitre(data.titre);
          setDescription(data.description);
          setPrix(data.prix);
          setDateDebut(data.date_debut.split('T')[0]);
          setDateFin(data.date_fin.split('T')[0]);
          setSelectedCollaborateur(data.id_collaborateur);
          setTypeOffre(data.type);
  setDestination(data.destination || '');
          setRemise(data.remise ? data.remise.toString().padStart(2, '0') : '');
 if (data.type === 'voyage' || data.type === 'activite') {
  setProgramme(data.details?.programme || '');
  setInclus(data.details?.inclus || '');
 }
          // Assuming additionalFields is correctly structured in the response
          if (data.type === 'voyage') {
            setNbrJours(data.details.nbr_jours);
          } else if (data.type === 'hotel') {
            setHotelName(data.details.nom_hotel);
            setEtoiles(data.details.etoiles);
            setClimatisation(data.details.climatisation);
            setWifi(data.details.wifi);
            setPiscineExterieure(data.details.piscine_exterieure);
            setPiscineCouverte(data.details.piscine_couverte);
            setBassinEnfants(data.details.bassin_enfants);
            setParking(data.details.parking);
            setDiscotheque(data.details.discotheque);
            setPlagePrivee(data.details.plage_privee);
            setAscenseur(data.details.ascenseur);
            setSalleDeSport(data.details.salle_de_sport);
            setAireDeJeuxEnfants(data.details.aire_de_jeux_enfants);
          } else if (data.type === 'activite') {
            setDuree(data.details.duree);
          }
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

  const handleTypeChange = (e) => {
    setTypeOffre(e.target.value);
    // Reset fields when changing type
    resetFields();
  };

  const resetFields = () => {
    setProgramme('');
    setInclus('');
    setNbrJours(0);
    setHotelName('');
    setEtoiles(0);
    setClimatisation(false);
    setWifi(false);
    setPiscineExterieure(false);
    setPiscineCouverte(false);
    setBassinEnfants(false);
    setParking(false);
    setDiscotheque(false);
    setPlagePrivee(false);
    setAscenseur(false);
    setSalleDeSport(false);
    setAireDeJeuxEnfants(false);
    setDuree(0);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      Swal.fire(
        'Attention',
        'Seules les 4 premières photos seront prises en compte.',
        'warning'
      );
      files.splice(4);
    }
    setImages(files);
  };

  const renderFieldsForTypeOffre = () => {
    switch (typeOffre) {
      case 'voyage':
        return renderVoyageFields();
      case 'hotel':
        return renderHotelFields();
      case 'activite':
        return renderActiviteFields();
      default:
        return null;
    }
  };
  
const renderSharedFields = () => (
  <>
    <label>
      Programme:
      <Editor
        apiKey="1y5o32iougly700k7a8m09628djopudgvzhhj5mq6ohwsjh6"
        init={{
          plugins:
            'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
          toolbar:
            'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Author name',
          mergetags_list: [
            { value: 'First.Name', title: 'First Name' },
            { value: 'Email', title: 'Email' },
          ],
          ai_request: (request, respondWith) =>
            respondWith.string(() =>
              Promise.reject('See docs to implement AI Assistant')
            ),
        }}
        value={programme}
        onEditorChange={(content, editor) => setProgramme(content)}
      />
    </label>
    <label>
      Inclus:
      <textarea
        type="text"
        value={inclus}
        onChange={(e) => setInclus(e.target.value)}
        required
      />
    </label>
  </>
);
  const renderVoyageFields = () => (
    <>
      {' '}
      {renderSharedFields()}
      <label>
        Nombre de Jours:
        <input
          type="number"
          value={nbr_jours}
          onChange={handleNbrJoursChange}
          min="0"
          required
        />
      </label>
    </>
  );

  const renderHotelFields = () => (
    <>
      <label>
        Nom de l'Hôtel:
        <input
          type="text"
          value={hotelName}
          onChange={(e) => setHotelName(e.target.value)}
          required
        />
      </label>
      <label>
        Étoiles:
        <input
          type="number"
          value={etoiles}
          onChange={handleEtoilesChange}
          min="0"
          required
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        Climatisation:
        <input
          type="checkbox"
          checked={climatisation}
          onChange={(e) => setClimatisation(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Wi-Fi:
        <input
          type="checkbox"
          checked={wifi}
          onChange={(e) => setWifi(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Piscine Extérieure:
        <input
          type="checkbox"
          checked={piscineExterieure}
          onChange={(e) => setPiscineExterieure(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Piscine Couverte:
        <input
          type="checkbox"
          checked={piscineCouverte}
          onChange={(e) => setPiscineCouverte(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Bassin pour Enfants:
        <input
          type="checkbox"
          checked={bassinEnfants}
          onChange={(e) => setBassinEnfants(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Parking:
        <input
          type="checkbox"
          checked={parking}
          onChange={(e) => setParking(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Discothèque:
        <input
          type="checkbox"
          checked={discotheque}
          onChange={(e) => setDiscotheque(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Plage Privée:
        <input
          type="checkbox"
          checked={plagePrivee}
          onChange={(e) => setPlagePrivee(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Ascenseur:
        <input
          type="checkbox"
          checked={ascenseur}
          onChange={(e) => setAscenseur(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Salle de Sport:
        <input
          type="checkbox"
          checked={salleDeSport}
          onChange={(e) => setSalleDeSport(e.target.checked)}
        />
      </label>
      <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        {' '}
        Aire de Jeux pour Enfants:
        <input
          type="checkbox"
          checked={aireDeJeuxEnfants}
          onChange={(e) => setAireDeJeuxEnfants(e.target.checked)}
        />
      </label>
    </>
  );

  const renderActiviteFields = () => (
    <>
      {renderSharedFields()}

      <label>
        Durée (en heures):
        <input
          type="number"
          value={duree}
          onChange={handleDureeChange}
          min="0"
          required
        />
      </label>
    </>
  );

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
    formData.append('type', typeOffre);
    formData.append('destination', destination);
    formData.append('remise', remise === '' ? 0 : parseInt(remise, 10));

    // Append additional fields based on type
if (typeOffre === 'voyage') {
    formData.append('programme', programme);
    formData.append('inclus', inclus);
    formData.append('nbr_jours', nbr_jours);
} else if (typeOffre === 'hotel') {
        formData.append('nom_hotel', hotelName);
        formData.append('etoiles', etoiles);
        formData.append('climatisation', climatisation);
        formData.append('wifi', wifi);
        formData.append('piscine_exterieure', piscineExterieure);
        formData.append('piscine_couverte', piscineCouverte);
        formData.append('bassin_enfants', bassinEnfants);
        formData.append('parking', parking);
        formData.append('discotheque', discotheque);
        formData.append('plage_privee', plagePrivee);
        formData.append('ascenseur', ascenseur);
        formData.append('salle_de_sport', salleDeSport);
        formData.append('aire_de_jeux_enfants', aireDeJeuxEnfants);
   }else if(typeOffre === 'activite') {
      formData.append('programme', programme);
      formData.append('inclus', inclus);
        formData.append('duree', duree);
    }

    images.forEach((image, index) =>
      formData.append('photos', image, image.name || `image_${index}.jpg`)
    );

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
console.log({
  titre,
  description,
  prix,
  date_debut,
  date_fin,
  destination,
  type: typeOffre,
  remise,
  programme,
  inclus,
  nbr_jours, // Add all relevant states
});

    const handleLocationSelect = (location) => {
      setDestination(location);
      console.log('Selected location coordinates: ', location);
    };
  const today = new Date().toISOString().split('T')[0];
  const handleNbrJoursChange = (e) => {
    const newNbrJours = parseInt(e.target.value, 10);
    setNbrJours(Math.max(0, newNbrJours)); // Assure que nbr_jours ne soit pas négatif
  };
  const handleDureeChange = (e) => {
    const newDuree = parseInt(e.target.value, 10);
    setDuree(Math.max(0, newDuree)); // Assure que la durée ne soit pas négative
  };
  const handleEtoilesChange = (e) => {
    const newEtoiles = parseInt(e.target.value, 10);
    setEtoiles(Math.max(0, newEtoiles)); // Assure que etoiles ne soit pas négatif
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
        Destination:
        <LocationSearchInput
          onLocationSelect={handleLocationSelect}
          initialLocation={destination}
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
      </label>
      <label>
        Remise (Entre 1% et 100%):
        <input
          type="text" // Use text type to maintain zero padding
          value={remise}
          onChange={handleRemiseChange}
          maxLength="3" // Limit length to 3 to avoid over 100
          required={remise !== ''}
        />
      </label>
      <label>
        Date de début de remise:
        <input
          type="date"
          value={date_debut}
          onChange={(e) => setDateDebut(e.target.value)}
          min={isUpdate && initialDataLoaded ? undefined : today}
          disabled={!remise} // Désactiver si remise n'est pas spécifiée
        />
      </label>
      <label>
        Date de fin de remise:
        <input
          type="date"
          value={date_fin}
          onChange={(e) => setDateFin(e.target.value)}
          min={date_debut || today}
          disabled={!remise} // Désactiver si remise n'est pas spécifiée
        />
      </label>
      <div>
        <label htmlFor="type">Catégorie :</label>
        <select value={typeOffre} onChange={handleTypeChange} required>
          <option value="">Sélectionnez le type d'offre</option>
          <option value="voyage">Voyage</option>
          <option value="hotel">Hôtel</option>
          <option value="activite">Activité</option>
        </select>
        {renderFieldsForTypeOffre()}
      </div>
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
          {isUpdate ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}

export default OffreForm;
