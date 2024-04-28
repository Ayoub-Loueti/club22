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
  const [typeOffre, setTypeOffre] = useState('');
  const [remise, setRemise] = useState('');
    const [destination, setDestination] = useState('');

  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  const [selectedCollaborateur, setSelectedCollaborateur] = useState('');
  const [images, setImages] = useState([]);

  // States for Voyage-specific fields
  const [programme, setProgramme] = useState('');
  const [inclus, setInclus] = useState('');
  const [nbrJours, setNbrJours] = useState(0);

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
  const [activityName, setActivityName] = useState('');
  const [participants, setParticipants] = useState(0);
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
          setDestination(data.destination);

          setRemise(data.remise ? data.remise.toString().padStart(2, '0') : '');

          // Assuming additionalFields is correctly structured in the response
          if (data.type === 'voyage') {
            setProgramme(data.additionalFields.programme);
            setInclus(data.additionalFields.inclus);
            setNbrJours(data.additionalFields.nbr_jours);
          } else if (data.type === 'hotel') {
            setHotelName(data.additionalFields.nom_hotel);
            setEtoiles(data.additionalFields.etoiles);
            setClimatisation(data.additionalFields.climatisation);
            setWifi(data.additionalFields.wifi);
            setPiscineExterieure(data.additionalFields.piscine_exterieure);
            setPiscineCouverte(data.additionalFields.piscine_couverte);
            setBassinEnfants(data.additionalFields.bassin_enfants);
            setParking(data.additionalFields.parking);
            setDiscotheque(data.additionalFields.discotheque);
            setPlagePrivee(data.additionalFields.plage_privee);
            setAscenseur(data.additionalFields.ascenseur);
            setSalleDeSport(data.additionalFields.salle_de_sport);
            setAireDeJeuxEnfants(data.additionalFields.aire_de_jeux_enfants);
          } else if (data.type === 'activite') {
            setActivityName(data.additionalFields.nom_activite);
            setParticipants(data.additionalFields.participants);
            setDuree(data.additionalFields.duree);
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
    setActivityName('');
    setParticipants(0);
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

  const renderVoyageFields = () => (
    <>
      {' '}
      <label>
        Programme:
        <textarea
          value={programme}
          onChange={(e) => setProgramme(e.target.value)}
          required
        />
      </label>
      <label>
        Inclus:
        <textarea
          value={inclus}
          onChange={(e) => setInclus(e.target.value)}
          required
        />
      </label>
      <label>
        Nombre de Jours:
        <input
          type="number"
          value={nbrJours}
          onChange={(e) => setNbrJours(e.target.value)}
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
          onChange={(e) => setEtoiles(e.target.value)}
          required
        />
      </label>
      <label>
        Climatisation:
        <input
          type="checkbox"
          checked={climatisation}
          onChange={(e) => setClimatisation(e.target.checked)}
        />
      </label>
      <label>
        Wi-Fi:
        <input
          type="checkbox"
          checked={wifi}
          onChange={(e) => setWifi(e.target.checked)}
        />
      </label>
      <label>
        Piscine Extérieure:
        <input
          type="checkbox"
          checked={piscineExterieure}
          onChange={(e) => setPiscineExterieure(e.target.checked)}
        />
      </label>
      <label>
        Piscine Couverte:
        <input
          type="checkbox"
          checked={piscineCouverte}
          onChange={(e) => setPiscineCouverte(e.target.checked)}
        />
      </label>
      <label>
        Bassin pour Enfants:
        <input
          type="checkbox"
          checked={bassinEnfants}
          onChange={(e) => setBassinEnfants(e.target.checked)}
        />
      </label>
      <label>
        Parking:
        <input
          type="checkbox"
          checked={parking}
          onChange={(e) => setParking(e.target.checked)}
        />
      </label>
      <label>
        Discothèque:
        <input
          type="checkbox"
          checked={discotheque}
          onChange={(e) => setDiscotheque(e.target.checked)}
        />
      </label>
      <label>
        Plage Privée:
        <input
          type="checkbox"
          checked={plagePrivee}
          onChange={(e) => setPlagePrivee(e.target.checked)}
        />
      </label>
      <label>
        Ascenseur:
        <input
          type="checkbox"
          checked={ascenseur}
          onChange={(e) => setAscenseur(e.target.checked)}
        />
      </label>
      <label>
        Salle de Sport:
        <input
          type="checkbox"
          checked={salleDeSport}
          onChange={(e) => setSalleDeSport(e.target.checked)}
        />
      </label>
      <label>
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
      <label>
        Nom de l'Activité:
        <input
          type="text"
          value={activityName}
          onChange={(e) => setActivityName(e.target.value)}
          required
        />
      </label>
      <label>
        Nombre de Participants:
        <input
          type="number"
          value={participants}
          onChange={(e) => setParticipants(e.target.value)}
          required
        />
      </label>
      <label>
        Durée (en heures):
        <input
          type="number"
          value={duree}
          onChange={(e) => setDuree(e.target.value)}
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
    formData.append('remise', remise === '' ? 0 : parseInt(remise, 10));

    // Append additional fields based on type
    switch (typeOffre) {
      case 'voyage':
        formData.append('programme', programme);
        formData.append('inclus', inclus);
        formData.append('nbr_jours', nbrJours);
        break;
      case 'hotel':
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
        break;
      case 'activite':
        formData.append('nom_activite', activityName);
        formData.append('participants', participants);
        formData.append('duree', duree);
        break;
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
  destination, // Check this value
  type: typeOffre,
  remise,
});

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
      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
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
        Destination:
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
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
          {isUpdate ? 'Modifier' : 'Ajouter'}
        </button>
      </div>

    </form>
  );
}

export default OffreForm;
