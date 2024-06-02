import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Avatar,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from '@mui/material';
import { addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const RoomDetails = ({
  room,
  updateRoom,
  deleteRoom,
  canDelete,
  details,
  updateRoomType,
}) => {
  const { t } = useTranslation();

  const [childAges, setChildAges] = useState(Array(room.children).fill(1));
  const defaultRoomType = details.typechambres.find((tc) => tc.defaultChambre);
  const [selectedRoomType, setSelectedRoomType] = useState(
    defaultRoomType?.id_TypeChambre || details.typechambres[0].id_TypeChambre
  );
  const [roomSupplement, setRoomSupplement] = useState(0);

  useEffect(() => {
    updateRoom(room.id, 'supplement', roomSupplement);
  }, [roomSupplement]);

  const handleRoomTypeChange = (event) => {
    const selectedTypeId = event.target.value;
    const selectedType = details.typechambres.find(
      (tc) => tc.id_TypeChambre === selectedTypeId
    );
    setSelectedRoomType(selectedTypeId);
    updateRoomType(room.id, selectedType.nom);
    if (!selectedType.defaultChambre) {
      setRoomSupplement(selectedType.supplement);
    } else {
      setRoomSupplement(0);
    }
  };
  const incrementAdults = () => {
    updateRoom(room.id, 'adults', room.adults + 1);
  };

  const decrementAdults = () => {
    updateRoom(room.id, 'adults', Math.max(1, room.adults - 1));
  };

  const incrementChildren = () => {
    updateRoom(room.id, 'children', room.children + 1);
    setChildAges([...childAges, 1]);
  };

  const decrementChildren = () => {
    if (room.children > 0) {
      updateRoom(room.id, 'children', room.children - 1);
      setChildAges(childAges.slice(0, -1));
    }
  };

  const handleAgeChange = (index, age) => {
    const updatedAges = [...childAges];
    updatedAges[index] = age;
    setChildAges(updatedAges);
  };

  const adapter = new AdapterDateFns({ locale: fr });
  return (
    <Box
      sx={{
        mb: 2,
        bgcolor: 'background.paper',
        p: 2,
        borderRadius: 'borderRadius',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h6" gutterBottom component="div">
          {t('Chambre')} {room.id}
        </Typography>
        {canDelete && (
          <IconButton onClick={() => deleteRoom(room.id)} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <FormControl fullWidth>
        <InputLabel>{t('Type de chambre')}</InputLabel>
        <Select
          value={selectedRoomType}
          label={t('Type de chambre')}
          onChange={handleRoomTypeChange}
        >
          {details.typechambres.map((type) => (
            <MenuItem key={type.id_TypeChambre} value={type.id_TypeChambre}>
              {type.nom} {type.defaultChambre ? '' : `(+${type.supplement} DT)`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={decrementAdults}
          disabled={room.adults <= 1}
          color="primary"
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
        <TextField
          size="small"
          value={room.adults}
          inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
          sx={{ width: '60px', mx: 1 }}
        />
        <IconButton
          onClick={incrementAdults}
          disabled={room.adults >= 4}
          color="primary"
        >
          <AddCircleOutlineIcon />
        </IconButton>
        <Typography sx={{ ml: 2 }}>{t('Adulte(s)')}</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={decrementChildren}
          disabled={room.children <= 0}
          color="primary"
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
        <TextField
          size="small"
          value={room.children}
          inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
          sx={{ width: '60px', mx: 1 }}
        />
        <IconButton
          onClick={incrementChildren}
          disabled={room.children >= 3}
          color="primary"
        >
          <AddCircleOutlineIcon />
        </IconButton>
        <Typography sx={{ ml: 2 }}>{t('Enfant(s)')}</Typography>
        {childAges.map((age, index) => (
          <TextField
            key={index}
            type="number"
            size="small"
            value={age}
            onChange={(e) => handleAgeChange(index, parseInt(e.target.value))}
            inputProps={{ min: 1, max: 12, style: { width: '50px' } }}
            sx={{ mx: 1 }}
          />
        ))}
      </Box>
      <Typography variant="body1">
        {t(' Prix de chambre :')} {room.prix.toFixed(2)} DT
      </Typography>
    </Box>
  );
};

const ReservationModal = ({
  isOpen,
  onRequestClose,
  offreId,
  prix,
  remise,
  nombre_enfants_gratuits,
  age_limit_gratuite,
  type,
  isAdherant,
  debut,
  fin,
  details,
  prix_enfants_payants,
  enfants_autorises,
}) => {
  const calculateDaysMultiplier = (start, end) => {
    if (!start || !end) return 1;
    const diffDays = (end - start) / (1000 * 3600 * 24) + 1;
    return Math.max(1, diffDays - 1);
  };

  const calculateRoomPrice = (
    adults,
    children,
    basePrice,
    isAdherant,
    supplement
  ) => {
    let priceIncrease = 0;
    if (adults > 1) {
      priceIncrease += (adults - 1) * basePrice;
    }
    const chargeableChildren = Math.max(0, children - nombre_enfants_gratuits);
    priceIncrease += chargeableChildren * prix_enfants_payants;
    let totalCost = basePrice + priceIncrease + supplement;
    if (isAdherant) {
      totalCost *= 1 - remise / 100;
    }
    return totalCost;
  };

  const initialRoomPrice = calculateRoomPrice(1, 0, prix, isAdherant);

  const [userInfo, setUserInfo] = useState(null);
  const [rooms, setRooms] = useState([
    { id: 1, adults: 2, children: 0, prix: initialRoomPrice },
  ]);
  const today = new Date();
  const [reservationStart, setReservationStart] = useState();
  const [reservationEnd, setReservationEnd] = useState();
  const [nombre, setNombre] = useState(1);
  const [nombreEnfants2, setNombreEnfants2] = useState(0);

  useEffect(() => {
    if (type === 'voyage' && debut) {
      const startDate = new Date(debut);
      const endDate = new Date(
        startDate.getTime() + details.nbr_jours * 24 * 60 * 60 * 1000
      );
      setReservationStart(startDate);
      setReservationEnd(endDate);
    }
  }, [type, debut]);

  const handleStartDateChange = (date) => {
    setReservationStart(date);
    if (type === 'voyage' && date) {
      const endDate = new Date(
        date.getTime() + details.nbr_jours * 24 * 60 * 60 * 1000
      );
      setReservationEnd(endDate);
    }
  };

  const handleEndDateChange = (date) => {
    setReservationEnd(date);
  };

  const [daysMultiplier, setDaysMultiplier] = useState(1);

  useEffect(() => {
    const newDaysMultiplier = calculateDaysMultiplier(
      reservationStart,
      reservationEnd
    );
    setDaysMultiplier(newDaysMultiplier);
  }, [reservationStart, reservationEnd, prix, remise, isAdherant]);

  useEffect(() => {
    const token = localStorage.getItem('login');
    const storedUserId = JSON.parse(localStorage.getItem('userId'));

    if (token && storedUserId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(
            `http://54.87.28.4/profil/${storedUserId}`,
            { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
          );
          setUserInfo(response.data.user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      fetchUserData();
    }
  }, []);

  const handleAddRoom = () => {
    const newRoomId = rooms.length ? rooms[rooms.length - 1].id + 1 : 1;
    const newRoom = {
      id: newRoomId,
      adults: 2,
      children: 0,
      prix: calculateRoomPrice(1, 0, prix, isAdherant),
    };
    setRooms([...rooms, newRoom]);
  };

  const handleRemoveRoom = (roomId) => {
    setRooms(
      rooms
        .filter((room) => room.id !== roomId)
        .map((room, index) => ({ ...room, id: index + 1 }))
    );
  };

  const updateRoom = (roomId, field, value) => {
    const room = rooms.find((room) => room.id === roomId);
    const updatedRoom = { ...room, [field]: value };
    updatedRoom.prix = calculateRoomPrice(
      updatedRoom.adults,
      updatedRoom.children,
      prix,
      isAdherant,
      updatedRoom.supplement
    );
    setRooms(rooms.map((room) => (room.id === roomId ? updatedRoom : room)));
  };
  const [modePaiement, setModePaiement] = useState('');
  const [autorisationDeductionSalaire, setAutorisationDeductionSalaire] =
    useState(false);
  const handlePaymentModeChange = (event) => {
    setModePaiement(event.target.value);
  };

  const handleAuthorizationChange = (event) => {
    setAutorisationDeductionSalaire(event.target.checked);
  };
  const showAlert = (message, color) => {
    const alertBox = document.createElement('div');
    alertBox.textContent = message;
    alertBox.style.cssText = `
    position: fixed;
    top: 7%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    border-radius: 8px;
    color: white;
    background-color: ${color};
    z-index: 100000;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    font-weight: bold;
    font-family: Arial, sans-serif;
    
  `;

    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 2000);
  };
  const updateRoomType = (roomId, typechambreR) => {
    setRooms(
      rooms.map((room) =>
        room.id === roomId ? { ...room, typechambreR } : room
      )
    );
  };

  const [nombreAdultes, setNombreAdultes] = useState(1);
  const [nombreEnfants, setNombreEnfants] = useState(0);
  const [totalPrice, setTotalPrice] = useState(prix);

  const incrementAdults = () => {
    setNombreAdultes(nombreAdultes + 1);
  };

  const decrementAdults = () => {
    setNombreAdultes(Math.max(1, nombreAdultes - 1));
  };

  const incrementChildren = () => {
    setNombreEnfants(nombreEnfants + 1);
  };

  const decrementChildren = () => {
    setNombreEnfants(Math.max(0, nombreEnfants - 1));
  };

  useEffect(() => {
    let newTotalPrice = prix;

    if (type === 'hotel') {
      newTotalPrice = rooms.reduce((acc, room) => acc + room.prix, 0);
    } else {
      if (nombreAdultes > 1) {
        newTotalPrice += (nombreAdultes - 1) * prix;
      }
      const chargeableChildren = Math.max(
        0,
        nombreEnfants - nombre_enfants_gratuits
      );
      newTotalPrice += chargeableChildren * prix_enfants_payants;

      if (isAdherant) {
        newTotalPrice *= 1 - remise / 100;
      }
    }
    setTotalPrice(newTotalPrice);
  }, [
    nombreAdultes,
    nombreEnfants,
    prix,
    prix_enfants_payants,
    nombre_enfants_gratuits,
    isAdherant,
    remise,
    rooms,
    type,
  ]);

  const [nombreMoisDeduction, setNombreMoisDeduction] = useState(1);

  const handleMoisDeductionChange = (event) => {
    setNombreMoisDeduction(event.target.value);
  };

  const calculateMaxMonths = (totalPrice) => {
    if (totalPrice < 300) return 1;
    if (totalPrice < 500) return 2;
    if (totalPrice < 700) return 3;
    if (totalPrice < 1000) return 4;
    if (totalPrice < 1300) return 5;
    if (totalPrice < 1600) return 6;
    return 8;
  };

  const calculateMinMonths = (totalPrice) => {
    if (totalPrice < 1000) return 1;
    if (totalPrice < 1600) return 2;
    return 3;
  };
  const { t } = useTranslation();

  const handleReservation = async () => {
    if (
      !modePaiement ||
      (modePaiement === 'deduction_salaire' && !autorisationDeductionSalaire)
    ) {
      let alertMessage = '';
      if (!modePaiement) {
        alertMessage = t('Veuillez sélectionner le mode de paiement.');
      } else {
        alertMessage = t('Veuillez autoriser la déduction sur votre salaire.');
      }
      showAlert(alertMessage, 'red');
      return;
    }

    const token = JSON.parse(localStorage.getItem('login'))?.token;
    let reservationStartAdjusted = reservationStart;
    let reservationEndAdjusted = reservationEnd;
    if (type === 'activite') {
      const startDate = new Date(reservationStart);
      startDate.setDate(startDate.getDate() + 1);
      reservationStartAdjusted = startDate;
    }
    if (type === 'hotel') {
      reservationStartAdjusted = new Date(reservationStartAdjusted);
      reservationStartAdjusted.setDate(reservationStartAdjusted.getDate() + 1);
      reservationEndAdjusted = new Date(reservationEndAdjusted);
      reservationEndAdjusted.setDate(reservationEndAdjusted.getDate() + 1);
    }

    const reservationData = {
      id_offre: offreId,
      hotels:
        type === 'hotel'
          ? rooms.map((room) => ({
              id: room.id,
              nbr_adults: room.adults,
              nbr_enfants: room.children,
              prix: room.prix,
              typechambreR: room.typechambreR,
            }))
          : [],
      nombre: type !== 'hotel' ? nombre : rooms.length,
      typeR: type,
      prix_totale:
        type === 'hotel'
          ? rooms.reduce((acc, room) => acc + room.prix, 0).toFixed(2)
          : totalPrice.toFixed(2),
      date_debut: reservationStartAdjusted.toISOString(),
      date_fin:
        type === 'activite' ? null : reservationEndAdjusted.toISOString(),
      mode_paiement: modePaiement,
      autorisation_deduction_salaire: autorisationDeductionSalaire,
      statut_paiement: '',
      montant_deduit: '',
      months: nombreMoisDeduction || 0,
      nbr_enfants: nombreEnfants || 0,
    };
    console.log(reservationData);

    try {
      await axios.post('http://54.87.28.4/reservation', reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Reservation successful');
      window.location.href = '/mesreservations';

      onRequestClose();
    } catch (error) {
      console.error(
        'Reservation failed:',
        error.response?.data || error.message
      );
    }
  };

  const incrementNombre = () => setNombre(nombre + 1);
  const decrementNombre = () => setNombre(Math.max(1, nombre - 1));
  const isDateSelected = reservationStart && reservationEnd;

  return (
    <Dialog open={isOpen} onClose={onRequestClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Détails de la réservation')}</DialogTitle>
      <DialogContent dividers>
        {userInfo && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              src={
                userInfo.photo
                  ? `http://54.87.28.4/${userInfo.photo}`
                  : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
              }
              alt="User"
              sx={{ width: 56, height: 56, mr: 2 }}
            />
            <Box>
              <Typography variant="subtitle1">
                {userInfo.nom} {userInfo.prenom}
              </Typography>
              <Typography variant="body2">{userInfo.email}</Typography>
            </Box>
          </Box>
        )}
        {remise > 0 && (
          <Typography
            variant="body"
            sx={{
              mt: 1,
              color: 'error.main',
              fontSize: '1rem',
              '&:hover': {
                color: 'error.dark',
              },
            }}
          >
            {t("Remise d'Adhésion Club22:")} {remise}%
          </Typography>
        )}
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 'bold',
            color: '#555',
            '&:hover': {
              color: '#555',
            },
            fontSize: '1.25rem',
          }}
        >
          {t('Prix')}: {prix.toFixed(2)} TND{' '}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#555',
            '&:hover': {
              color: '#555',
            },
            fontSize: '1.25rem',
          }}
        >
          {t('DATE DE RESERVATION')} :{' '}
        </Typography>

        {type === 'hotel' && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
              {' '}
              <MobileDatePicker
                label={t('Arrivée')}
                value={reservationStart}
                onChange={handleStartDateChange}
                minDate={today}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('jj/mm/aaaa')}
                    fullWidth
                    error={!reservationStart}
                    helperText={
                      !reservationStart ? t('Sélection obligatoire') : ''
                    }
                  />
                )}
              />
              <MobileDatePicker
                label={t('Départ')}
                value={reservationEnd}
                onChange={handleEndDateChange}
                minDate={addDays(reservationStart, 1)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('jj/mm/aaaa')}
                    fullWidth
                    error={!reservationEnd}
                    helperText={
                      !reservationEnd ? t('Sélection obligatoire') : ''
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </>
        )}
        {type === 'voyage' && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
              <MobileDatePicker
                label={t('Départ')}
                value={reservationStart}
                onChange={handleStartDateChange}
                minDate={today}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('jj/mm/aaaa')}
                    fullWidth
                    error={!reservationStart}
                    helperText={
                      !reservationStart ? t('Sélection obligatoire') : ''
                    }
                  />
                )}
              />
              <MobileDatePicker
                label={t('Retour')}
                value={reservationEnd}
                onChange={handleEndDateChange}
                minDate={reservationStart}
                disabled={type === 'voyage'}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('jj/mm/aaaa')}
                    fullWidth
                    error={!reservationEnd}
                    helperText={
                      !reservationEnd ? t('Sélection obligatoire') : ''
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </>
        )}
        {type === 'activite' && (
          <>
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
              <MobileDatePicker
                label={t('Date de début')}
                value={reservationStart}
                onChange={handleStartDateChange}
                minDate={today}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t('jj/mm/aaaa')}
                    fullWidth
                    error={!reservationStart}
                    helperText={
                      !reservationStart ? t('Sélection obligatoire') : ''
                    }
                  />
                )}
              />
            </LocalizationProvider>
          </>
        )}

        <Box sx={{ maxHeight: '40vh', overflowY: 'auto' }}>
          {type === 'hotel' ? (
            rooms.map((room, index) => (
              <RoomDetails
                key={room.id}
                room={room}
                updateRoom={updateRoom}
                deleteRoom={handleRemoveRoom}
                canDelete={rooms.length > 1}
                details={details}
                updateRoomType={updateRoomType}
              />
            ))
          ) : (
            <>
              <Box>
                <Typography variant="h6">{t("Nombre d'adultes:")}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    onClick={decrementAdults}
                    disabled={nombreAdultes <= 1}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <TextField
                    size="small"
                    value={nombreAdultes}
                    inputProps={{
                      readOnly: true,
                      style: { textAlign: 'center' },
                    }}
                    sx={{ width: '60px' }}
                  />
                  <IconButton onClick={incrementAdults}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              </Box>
              {enfants_autorises && (
                <Box>
                  <Typography variant="h6">{t("Nombre d'enfants:")}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      onClick={decrementChildren}
                      disabled={nombreEnfants <= 0}
                    >
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      value={nombreEnfants}
                      onChange={(e) =>
                        setNombreEnfants2(Number(e.target.value))
                      }
                      inputProps={{
                        readOnly: true,
                        style: { textAlign: 'center' },
                      }}
                      sx={{ width: '60px' }}
                    />
                    <IconButton onClick={incrementChildren}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                {t('Prix total:')} {totalPrice.toFixed(2)} DT
              </Typography>
            </>
          )}
        </Box>
        {type === 'hotel' && (
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddRoom}
            sx={{
              mt: 2,
              color: 'white',
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            {t('Ajouter une chambre')}
          </Button>
        )}

        {type === 'hotel' && (
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: 'medium',
              color: '#555',
              fontSize: '1.15rem',
            }}
          >
            {t('Prix total:')}{' '}
            {(
              rooms.reduce((acc, room) => acc + room.prix, 0) * daysMultiplier
            ).toFixed(2)}{' '}
            TND
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              mt: 2,
              fontWeight: 'bold',
              color: '#555',
              '&:hover': {
                color: '#555',
              },
              fontSize: '1.25rem',
            }}
          >
            {t('PAIEMENT')} :
          </Typography>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="mode-paiement-label" sx={{}}>
              {t('Mode de paiement')}
            </InputLabel>
            <Select
              labelId="mode-paiement-label"
              id="mode-paiement-select"
              value={modePaiement}
              onChange={handlePaymentModeChange}
              fullWidth
              required
              label={t('Mode de paiement')}
              sx={{
                '& .MuiSelect-select': {
                  pl: 2,
                  pr: 1,
                },
              }}
            >
              <MenuItem value="especes">{t('Espèces')}</MenuItem>
              <MenuItem value="deduction_salaire">
                {t('Déduction sur le salaire')}
              </MenuItem>
              <MenuItem value="paiement_en_ligne">{t('En ligne')}</MenuItem>
            </Select>
          </FormControl>
          {modePaiement === 'deduction_salaire' && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {t('Sur combien de mois souhaitez-vous étaler la déduction?')}
              </Typography>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel id="mois-deduction-label">
                  {t('Nombre de mois')}
                </InputLabel>
                <Select
                  labelId="mois-deduction-label"
                  id="mois-deduction-select"
                  value={nombreMoisDeduction}
                  onChange={handleMoisDeductionChange}
                  label="Nombre de mois"
                >
                  {Array.from(
                    { length: calculateMaxMonths(totalPrice) },
                    (_, i) => i + calculateMinMonths(totalPrice)
                  ).map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {modePaiement === 'deduction_salaire' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={autorisationDeductionSalaire}
                  onChange={handleAuthorizationChange}
                  required
                />
              }
              label={t(
                "J'autorise la déduction sur mon salaire pour cette réservation"
              )}
              sx={{ mb: 2 }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={onRequestClose}>
          {t('Annuler')}
        </Button>
        <Button
          onClick={handleReservation}
          variant="contained"
          color="secondary"
          disabled={
            (type === 'hotel' && !isDateSelected) ||
            (type === 'activite' && !reservationStart)
          }
        >
          {t('Réserver')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReservationModal;
