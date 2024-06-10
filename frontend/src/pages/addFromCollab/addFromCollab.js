import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  TextField,
  OutlinedInput,
  FormControlLabel,
} from '@mui/material';

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

  const [spa, setSpa] = useState(false);
  const [sauna, setSauna] = useState(false);
  const [hammam, setHammam] = useState(false);
  const [thalasso, setThalasso] = useState(false);
  const [centreEsthetique, setCentreEsthetique] = useState(false);
  const [toboggan, setToboggan] = useState(false);
  const [piedsDansLEau, setPiedsDansLEau] = useState(false);
  const [piscineEauDeMer, setPiscineEauDeMer] = useState(false);
  const [babySetting, setBabySetting] = useState(false);
  const [tennisDeTable, setTennisDeTable] = useState(false);
  const [locationDeVoiture, setLocationDeVoiture] = useState(false);
  const [changeMonetaire, setChangeMonetaire] = useState(false);
  
  const [interditCelibataires, setInterditCelibataires] = useState(false);
  const [interditBurkini, setInterditBurkini] = useState(false);
  const [interditAlcohol, setInterditAlcohol] = useState(false);

  // States for Activité-specific fields
  const [duree, setDuree] = useState(0);

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [defaultChambre, setDefaultChambre] = useState('');
  const [supplements, setSupplements] = useState({});

  const [vueMer, setVueMer] = useState({});
  const [prixVueMer, setPrixVueMer] = useState({});
  const [vuePiscine, setVuePiscine] = useState({});
  const [prixVuePiscine, setPrixVuePiscine] = useState({});

  const [single, setSingle] = useState({});
  const [prixsingle, setPrixsingle] = useState({});

  const [logementSeulement, setLogementSeulement] = useState(false);
  const [prixLogementSeulement, setPrixLogementSeulement] = useState(0);
  const [petitDejeuner, setPetitDejeuner] = useState(false);
  const [prixDemiPension, setPrixDemiPension] = useState(0);
  const [demiPension, setDemiPension] = useState(false);
  const [prixDemiPensionPlus, setPrixDemiPensionPlus] = useState(0);
  const [demiPensionPlus, setDemiPensionPlus] = useState(false);
  const [prixPensionComplete, setPrixPensionComplete] = useState(0);
  const [pensionComplete, setPensionComplete] = useState(false);
  const [prixPensionCompletePlus, setPrixPensionCompletePlus] = useState(0);
  const [pensionCompletePlus, setPensionCompletePlus] = useState(false);
  const [prixAllInclusive, setPrixAllInclusive] = useState(0);
  const [allInclusive, setAllInclusive] = useState(false);
  const [prixAllInclusiveSoft, setPrixAllInclusiveSoft] = useState(0);
  const [allInclusiveSoft, setAllInclusiveSoft] = useState(false);
  const [pensionDefault, setPensionDefault] = useState('');
  const [prixPetitDejeuner, setPrixPetitDejeuner] = useState('');

  const typesChambresOptions = [
    { id: 'standard', nom: 'Chambre standard' },
    { id: 'double', nom: 'Chambre double' },
    { id: 'familiale', nom: 'Chambre familiale' },
    { id: 'communicante', nom: 'Chambre communicante' },
    { id: 'suite', nom: 'Suite' },
    { id: 'suite_royale', nom: 'Suite royale' },
  ];
  const typeChambresData = selectedTypes.map((typeId) => ({
    nom: typesChambresOptions.find((type) => type.id === typeId).nom,
    supplement: supplements[typeId] || 0,
    defaultChambre: defaultChambre === typeId,
  }));
  const handleTypeChambreChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedTypes(typeof value === 'string' ? value.split(',') : value);
  };

  const handleDefaultPensionChange = (pens, setPrice) => {
    if (pensionDefault !== pens) {
      setPensionDefault(pens);
      resetAllPensionPrices();
      setPrice(0);
    }
  };

  const resetAllPensionPrices = () => {
    if (pensionDefault !== 'logement_seulement') setPrixLogementSeulement(0);
    if (pensionDefault !== 'petit_dejeuner') setPrixPetitDejeuner(0);
    if (pensionDefault !== 'demi_pension') setPrixDemiPension(0);
    if (pensionDefault !== 'demi_pension_plus') setPrixDemiPensionPlus(0);
    if (pensionDefault !== 'pension_complete') setPrixPensionComplete(0);
    if (pensionDefault !== 'pension_complete_plus')
      setPrixPensionCompletePlus(0);
    if (pensionDefault !== 'all_inclusive') setPrixAllInclusive(0);
    if (pensionDefault !== 'all_inclusive_soft') setPrixAllInclusiveSoft(0);
  };

  const renderPensionOptions = () => (
    <div>
      <h3>Options de Pension</h3>
      {renderPensionCheckbox(
        'Logement Seulement',
        'logement_seulement',
        logementSeulement,
        setLogementSeulement,
        prixLogementSeulement,
        setPrixLogementSeulement
      )}
      {renderPensionCheckbox(
        'Petit Déjeuner',
        'petit_dejeuner',
        petitDejeuner,
        setPetitDejeuner,
        prixPetitDejeuner,
        setPrixPetitDejeuner
      )}
      {renderPensionCheckbox(
        'Demi Pension',
        'demi_pension',
        demiPension,
        setDemiPension,
        prixDemiPension,
        setPrixDemiPension
      )}
      {renderPensionCheckbox(
        'Demi Pension Plus',
        'demi_pension_plus',
        demiPensionPlus,
        setDemiPensionPlus,
        prixDemiPensionPlus,
        setPrixDemiPensionPlus
      )}
      {renderPensionCheckbox(
        'Pension Complète',
        'pension_complete',
        pensionComplete,
        setPensionComplete,
        prixPensionComplete,
        setPrixPensionComplete
      )}
      {renderPensionCheckbox(
        'Pension Complète Plus',
        'pension_complete_plus',
        pensionCompletePlus,
        setPensionCompletePlus,
        prixPensionCompletePlus,
        setPrixPensionCompletePlus
      )}
      {renderPensionCheckbox(
        'All Inclusive',
        'all_inclusive',
        allInclusive,
        setAllInclusive,
        prixAllInclusive,
        setPrixAllInclusive
      )}
      {renderPensionCheckbox(
        'All Inclusive Soft',
        'all_inclusive_soft',
        allInclusiveSoft,
        setAllInclusiveSoft,
        prixAllInclusiveSoft,
        setPrixAllInclusiveSoft
      )}
    </div>
  );

  const renderPensionCheckbox = (
    label,
    pens,
    checked,
    setChecked,
    price,
    setPrice
  ) => (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
        }
        label={label}
      />
      {checked && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
          <TextField
            label="Prix +"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
            InputProps={{ inputProps: { min: 0 } }}
            disabled={pensionDefault === pens}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={pensionDefault === pens}
                onChange={() => handleDefaultPensionChange(pens, setPrice)}
              />
            }
            label="Défaut"
          />
        </div>
      )}
    </div>
  );

  const handleDefaultChambreChange = (event) => {
    setDefaultChambre(event.target.value);
  };

  const handleSupplementChange = (typeId, value) => {
    setSupplements((prev) => ({ ...prev, [typeId]: value }));
  };

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
            <FormControl fullWidth className="type-chambre-selection">
        <InputLabel id="demo-multiple-checkbox-label">
          Type de Chambre
        </InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          required
          value={selectedTypes}
          onChange={handleTypeChambreChange}
          input={<OutlinedInput label="Type de Chambre" />}
          renderValue={(selected) =>
            selected
              .map(
                (id) => typesChambresOptions.find((type) => type.id === id).nom
              )
              .join(', ')
          }
        >
          {typesChambresOptions.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              <Checkbox checked={selectedTypes.includes(type.id)} />
              <ListItemText primary={type.nom} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="default-chambre-selection">
        <InputLabel id="default-chambre-label">Chambre par Défaut</InputLabel>
        <Select
          labelId="default-chambre-label"
          id="default-chambre-select"
          value={defaultChambre}
          label="Chambre par Défaut"
          onChange={handleDefaultChambreChange}
          required
        >
          {selectedTypes.map((typeId) => (
            <MenuItem key={typeId} value={typeId}>
              {typesChambresOptions.find((type) => type.id === typeId).nom}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedTypes.map((typeId) => {
        if (typeId === defaultChambre) {
          return (
            <div key={typeId} style={{ color: 'red' }}>
              <div>
                {typesChambresOptions.find((type) => type.id === typeId).nom}{' '}
                (Par defaut)
              </div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={single[typeId] || false}
                    onChange={(e) =>
                      setSingle({ ...single, [typeId]: e.target.checked })
                    }
                  />
                }
                label="Single"
              />
              {single[typeId] && (
                <TextField
                  label="Prix + supp single"
                  type="number"
                  value={prixsingle[typeId] || ''}
                  onChange={(e) =>
                    setPrixsingle({ ...prixsingle, [typeId]: e.target.value })
                  }
                  fullWidth
                />
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={vueMer[typeId] || false}
                    onChange={(e) =>
                      setVueMer({ ...vueMer, [typeId]: e.target.checked })
                    }
                  />
                }
                label="Vue sur Mer"
              />
              {vueMer[typeId] && (
                <TextField
                  label="Prix + supp vue sur mer"
                  type="number"
                  value={prixVueMer[typeId] || ''}
                  onChange={(e) =>
                    setPrixVueMer({ ...prixVueMer, [typeId]: e.target.value })
                  }
                  fullWidth
                />
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={vuePiscine[typeId] || false}
                    onChange={(e) =>
                      setVuePiscine({
                        ...vuePiscine,
                        [typeId]: e.target.checked,
                      })
                    }
                  />
                }
                label="Vue sur Piscine"
              />
              {vuePiscine[typeId] && (
                <TextField
                  label="Prix + supp vue sur piscine"
                  type="number"
                  value={prixVuePiscine[typeId] || ''}
                  onChange={(e) =>
                    setPrixVuePiscine({
                      ...prixVuePiscine,
                      [typeId]: e.target.value,
                    })
                  }
                  fullWidth
                />
              )}
            </div>
          );
        } else {
          return (
            <div key={typeId}>
              <TextField
                label={`Supplément pour ${
                  typesChambresOptions.find((type) => type.id === typeId).nom
                }`}
                type="number"
                value={supplements[typeId] || ''}
                onChange={(e) => handleSupplementChange(typeId, e.target.value)}
                fullWidth
                className="supplement-input"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={single[typeId] || false}
                    onChange={(e) =>
                      setSingle({ ...single, [typeId]: e.target.checked })
                    }
                  />
                }
                label="Single"
              />
              {single[typeId] && (
                <TextField
                  label="Prix + supp single"
                  type="number"
                  value={prixsingle[typeId] || ''}
                  onChange={(e) =>
                    setPrixsingle({ ...prixsingle, [typeId]: e.target.value })
                  }
                  fullWidth
                />
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={vueMer[typeId] || false}
                    onChange={(e) =>
                      setVueMer({ ...vueMer, [typeId]: e.target.checked })
                    }
                  />
                }
                label="Vue sur Mer"
              />
              {vueMer[typeId] && (
                <TextField
                  label="Prix + supp vue sur mer"
                  type="number"
                  value={prixVueMer[typeId] || ''}
                  onChange={(e) =>
                    setPrixVueMer({ ...prixVueMer, [typeId]: e.target.value })
                  }
                  fullWidth
                />
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={vuePiscine[typeId] || false}
                    onChange={(e) =>
                      setVuePiscine({
                        ...vuePiscine,
                        [typeId]: e.target.checked,
                      })
                    }
                  />
                }
                label="Vue sur Piscine"
              />
              {vuePiscine[typeId] && (
                <TextField
                  label="Prix + supp vue sur piscine"
                  type="number"
                  value={prixVuePiscine[typeId] || ''}
                  onChange={(e) =>
                    setPrixVuePiscine({
                      ...prixVuePiscine,
                      [typeId]: e.target.value,
                    })
                  }
                  fullWidth
                />
              )}
            </div>
          );
        }
      })}
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
            <label
        style={{
          flexDirection: 'row',
          color: '#4A5568',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        Spa:
        <input
          type="checkbox"
          checked={spa}
          onChange={(e) => setSpa(e.target.checked)}
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
        Sauna:
        <input
          type="checkbox"
          checked={sauna}
          onChange={(e) => setSauna(e.target.checked)}
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
        Hammam:
        <input
          type="checkbox"
          checked={hammam}
          onChange={(e) => setHammam(e.target.checked)}
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
        Thalasso:
        <input
          type="checkbox"
          checked={thalasso}
          onChange={(e) => setThalasso(e.target.checked)}
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
        Centre Esthétique:
        <input
          type="checkbox"
          checked={centreEsthetique}
          onChange={(e) => setCentreEsthetique(e.target.checked)}
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
        Toboggan:
        <input
          type="checkbox"
          checked={toboggan}
          onChange={(e) => setToboggan(e.target.checked)}
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
        Pieds dans l'Eau:
        <input
          type="checkbox"
          checked={piedsDansLEau}
          onChange={(e) => setPiedsDansLEau(e.target.checked)}
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
        Piscine Eau de Mer:
        <input
          type="checkbox"
          checked={piscineEauDeMer}
          onChange={(e) => setPiscineEauDeMer(e.target.checked)}
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
        Baby Setting:
        <input
          type="checkbox"
          checked={babySetting}
          onChange={(e) => setBabySetting(e.target.checked)}
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
        Tennis de Table:
        <input
          type="checkbox"
          checked={tennisDeTable}
          onChange={(e) => setTennisDeTable(e.target.checked)}
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
        Location de Voiture:
        <input
          type="checkbox"
          checked={locationDeVoiture}
          onChange={(e) => setLocationDeVoiture(e.target.checked)}
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
        Change Monétaire:
        <input
          type="checkbox"
          checked={changeMonetaire}
          onChange={(e) => setChangeMonetaire(e.target.checked)}
        />
      </label>
      <div className="interdictions-section">
        <h3>Interdictions</h3>
        <div className="offre-checkbox-groupInterdit ">
          <FormControlLabel
            control={
              <Checkbox
                checked={interditCelibataires}
                onChange={(e) => setInterditCelibataires(e.target.checked)}
                name="interditCelibataires"
              />
            }
            label="Célibataires"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={interditBurkini}
                onChange={(e) => setInterditBurkini(e.target.checked)}
                name="interditBurkini"
              />
            }
            label="Burkini"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={interditAlcohol}
                onChange={(e) => setInterditAlcohol(e.target.checked)}
                name="interditAlcohol"
              />
            }
            label="Alcool"
          />
        </div>
        </div>
        {renderPensionOptions()}
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
          `http://localhost:5000/checkValidation/${id_collaborateur}`
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
    const isDefaultPensionSelected =
    typeOffre === 'hotel' &&
    (logementSeulement ||
      petitDejeuner ||
      demiPension ||
      demiPensionPlus ||
      pensionComplete ||
      pensionCompletePlus ||
      allInclusive ||
      allInclusiveSoft);

  if (typeOffre === 'hotel' && !isDefaultPensionSelected) {
    Swal.fire(
      'Erreur',
      "Vous devez sélectionner au moins une pension par défaut pour les offres d'hôtel avant de soumettre.",
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
      formData.append('spa', spa);
      formData.append('sauna', sauna);
      formData.append('hammam', hammam);
      formData.append('logement_seulement', logementSeulement ? 1 : 0);
      formData.append('prix_logement_seulement', prixLogementSeulement);
      formData.append('petit_dejeuner', petitDejeuner ? 1 : 0);
      formData.append('prix_petit_dejeuner', prixPetitDejeuner);
      formData.append('demi_pension', demiPension ? 1 : 0);
      formData.append('prix_demi_pension', prixDemiPension);
      formData.append('demi_pension_plus', demiPensionPlus ? 1 : 0);
      formData.append('prix_demi_pension_plus', prixDemiPensionPlus);
      formData.append('pension_complete', pensionComplete ? 1 : 0);
      formData.append('prix_pension_complete', prixPensionComplete);
      formData.append('pension_complete_plus', pensionCompletePlus ? 1 : 0);
      formData.append('prix_pension_complete_plus', prixPensionCompletePlus);
      formData.append('all_inclusive', allInclusive ? 1 : 0);
      formData.append('prix_all_inclusive', prixAllInclusive);
      formData.append('all_inclusive_soft', allInclusiveSoft ? 1 : 0);
      formData.append('prix_all_inclusive_soft', prixAllInclusiveSoft);
      formData.append('pensiondefault', pensionDefault);
      selectedTypes.forEach((typeId, index) => {
        const typeChambre = typesChambresOptions.find(
          (type) => type.id === typeId
        );
        formData.append(`typechambres[${index}][nom]`, typeChambre.nom);
        formData.append(
          `typechambres[${index}][supplement]`,
          supplements[typeId] || 0
        );
        formData.append(
          `typechambres[${index}][defaultChambre]`,
          defaultChambre === typeId
        );
        formData.append(
          `typechambres[${index}][vuemer]`,
          vueMer[typeId] || false
        );
        formData.append(
          `typechambres[${index}][supplementmer]`,
          prixVueMer[typeId] || 0
        );
        formData.append(
          `typechambres[${index}][vuepis]`,
          vuePiscine[typeId] || false
        );
        formData.append(
          `typechambres[${index}][supplementpis]`,
          prixVuePiscine[typeId] || 0
        );
        formData.append(
          `typechambres[${index}][single]`,
          single[typeId] || false
        );
        formData.append(
          `typechambres[${index}][prixsingle]`,
          prixsingle[typeId] || 0
        );
      });
      formData.append('thalasso', thalasso);
      formData.append('centre_esthetique', centreEsthetique);
      formData.append('toboggan', toboggan);
      formData.append('pieds_dans_l_eau', piedsDansLEau);
      formData.append('piscine_eau_de_mer', piscineEauDeMer);
      formData.append('baby_setting', babySetting);
      formData.append('tennis_de_table', tennisDeTable);
      formData.append('location_de_voiture', locationDeVoiture);
      formData.append('change_monetaire', changeMonetaire);
      formData.append('interdit_celibataires', interditCelibataires);
      formData.append('interdit_burkini', interditBurkini);
      formData.append('interdit_alcohol', interditAlcohol);
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
        `http://localhost:5000/offerFromCollab/${id_collaborateur}`,
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
