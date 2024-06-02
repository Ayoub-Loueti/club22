import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

function AddFromCollaborateur() {
  const { id_collaborateur } = useParams();
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState(0);
  const [date_debut, setDateDebut] = useState('');
  const [date_fin, setDateFin] = useState('');
  const [typeOffre, setTypeOffre] = useState('');
  const [remise, setRemise] = useState(0);
  const [accessGranted, setAccessGranted] = useState(true);
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

  const renderFieldsForTypeOffre = () => {
    switch (typeOffre) {
      case 'voyage':
        return (
          <>
            <label>
              Programme:{' '}
              <textarea
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
              />
            </label>
            <label>
              Inclus:{' '}
              <textarea
                value={inclus}
                onChange={(e) => setInclus(e.target.value)}
              />
            </label>
            <label>
              Nombre de Jours:{' '}
              <input
                type="number"
                value={nbr_jours}
                onChange={(e) => setNbrJours(parseInt(e.target.value, 10))}
              />
            </label>
          </>
        );
      case 'hotel':
        return (
          <>
            <label>
              Nom de l'Hôtel:{' '}
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              />
            </label>
            <label>
              Étoiles:{' '}
              <input
                type="number"
                value={etoiles}
                onChange={(e) => setEtoiles(parseInt(e.target.value, 10))}
              />
            </label>
            <label>
              Climatisation:{' '}
              <input
                type="checkbox"
                checked={climatisation}
                onChange={(e) => setClimatisation(e.target.checked)}
              />
            </label>
            <label>
              Wi-Fi:{' '}
              <input
                type="checkbox"
                checked={wifi}
                onChange={(e) => setWifi(e.target.checked)}
              />
            </label>
            <label>
              Piscine Extérieure:{' '}
              <input
                type="checkbox"
                checked={piscineExterieure}
                onChange={(e) => setPiscineExterieure(e.target.checked)}
              />
            </label>
            <label>
              Piscine Couverte:{' '}
              <input
                type="checkbox"
                checked={piscineCouverte}
                onChange={(e) => setPiscineCouverte(e.target.checked)}
              />
            </label>
            <label>
              Bassin pour Enfants:{' '}
              <input
                type="checkbox"
                checked={bassinEnfants}
                onChange={(e) => setBassinEnfants(e.target.checked)}
              />
            </label>
            <label>
              Parking:{' '}
              <input
                type="checkbox"
                checked={parking}
                onChange={(e) => setParking(e.target.checked)}
              />
            </label>
            <label>
              Discothèque:{' '}
              <input
                type="checkbox"
                checked={discotheque}
                onChange={(e) => setDiscotheque(e.target.checked)}
              />
            </label>
            <label>
              Plage Privée:{' '}
              <input
                type="checkbox"
                checked={plagePrivee}
                onChange={(e) => setPlagePrivee(e.target.checked)}
              />
            </label>
            <label>
              Ascenseur:{' '}
              <input
                type="checkbox"
                checked={ascenseur}
                onChange={(e) => setAscenseur(e.target.checked)}
              />
            </label>
            <label>
              Salle de Sport:{' '}
              <input
                type="checkbox"
                checked={salleDeSport}
                onChange={(e) => setSalleDeSport(e.target.checked)}
              />
            </label>
            <label>
              Aire de Jeux pour Enfants:{' '}
              <input
                type="checkbox"
                checked={aireDeJeuxEnfants}
                onChange={(e) => setAireDeJeuxEnfants(e.target.checked)}
              />
            </label>
          </>
        );
      case 'activite':
        return (
          <>
            <label>
              Programme:{' '}
              <textarea
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
              />
            </label>
            <label>
              Inclus:{' '}
              <textarea
                value={inclus}
                onChange={(e) => setInclus(e.target.value)}
              />
            </label>
            <label>
              Durée (en heures):{' '}
              <input
                type="number"
                value={duree}
                onChange={(e) => setDuree(parseInt(e.target.value, 10))}
              />
            </label>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://54.87.28.4/checkValidation/${id_collaborateur}`
        );
        if (response.data.result === 0) {
          setAccessGranted(false);
          Swal.fire({
            title: 'Accès refusé',
            text: "Vous n'avez pas accès à cette page, veuillez contacter l'administrateur.",
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id_collaborateur]);

  if (!accessGranted) {
    return null; // Or render a specific component or message indicating no access
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('description', description);
    formData.append('prix', prix);
    formData.append('date_debut', date_debut);
    formData.append('date_fin', date_fin);
    formData.append('type', typeOffre);
    formData.append('remise', remise);

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
    } else if (typeOffre === 'activite') {
      formData.append('programme', programme);
      formData.append('inclus', inclus);
      formData.append('duree', duree);
    }
    images.forEach((image, index) =>
      formData.append('photos', image, image.name || `image_${index}.jpg`)
    );
    try {
      const response = await axios.post(
        `http://54.87.28.4/offerFromCollab/${id_collaborateur}`,
        formData
      );
      Swal.fire('Succès', "L'offre a été ajoutée avec succès.", 'success');
    } catch (error) {
      console.error('Erreur:', error);
      Swal.fire(
        'Erreur',
        "Une erreur s'est produite lors de l'ajout de l'offre.",
        'error'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Titre:{' '}
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
        />
      </label>
      <label>
        Description:{' '}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Prix:{' '}
        <input
          type="number"
          value={prix}
          onChange={(e) => setPrix(parseFloat(e.target.value))}
          required
        />
      </label>
      <label>
        Date de début:{' '}
        <input
          type="date"
          value={date_debut}
          onChange={(e) => setDateDebut(e.target.value)}
          required
        />
      </label>
      <label>
        Date de fin:{' '}
        <input
          type="date"
          value={date_fin}
          onChange={(e) => setDateFin(e.target.value)}
          required
        />
      </label>
      <label>
        Type d'offre:
        <select value={typeOffre} onChange={handleTypeChange} required>
          <option value="">Sélectionnez le type d'offre</option>
          <option value="voyage">Voyage</option>
          <option value="hotel">Hôtel</option>
          <option value="activite">Activité</option>
        </select>
      </label>
      {renderFieldsForTypeOffre()}
      <label>
        Remise:{' '}
        <input
          type="number"
          value={remise}
          onChange={(e) => setRemise(parseInt(e.target.value, 10))}
        />
      </label>
      <label>
        Images:
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </label>
      <button type="submit">Ajouter l'offre</button>
    </form>
  );
}
export default AddFromCollaborateur;
