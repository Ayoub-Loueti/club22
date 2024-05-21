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
  Select
} from '@mui/material';
import { addDays } from 'date-fns';
import { fr } from 'date-fns/locale'; 

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const RoomDetails = ({ room, updateRoom, deleteRoom, canDelete }) => {
  const [childAges, setChildAges] = useState(Array(room.children).fill(1)); // Initialize with age 1

    const incrementAdults = () => {
        updateRoom(room.id, 'adults', room.adults + 1);
    };

    const decrementAdults = () => {
        updateRoom(room.id, 'adults', Math.max(1, room.adults - 1));
    };

    const incrementChildren = () => {
      updateRoom(room.id, 'children', room.children + 1);
      setChildAges([...childAges, 1]); // Add default age 1 for the new child
  };

  const decrementChildren = () => {
      if (room.children > 0) {
          updateRoom(room.id, 'children', room.children - 1);
          setChildAges(childAges.slice(0, -1)); // Remove the last child's age
      }
  };

  const handleAgeChange = (index, age) => {
      const updatedAges = [...childAges];
      updatedAges[index] = age;
      setChildAges(updatedAges);
  };

    
const adapter = new AdapterDateFns({ locale: fr });
    return (
        <Box sx={{ mb: 2, bgcolor: 'background.paper', p: 2, borderRadius: 'borderRadius', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom component="div">
                    Chambre {room.id}
                </Typography>
                {canDelete && (
                    <IconButton onClick={() => deleteRoom(room.id)} color="error">
                        <DeleteIcon />
                    </IconButton>
                )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={decrementAdults} disabled={room.adults <= 1} color="primary">
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <TextField
                    size="small"
                    value={room.adults}
                    inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                    sx={{ width: '60px', mx: 1 }}
                />
                <IconButton onClick={incrementAdults} disabled={room.adults >= 4} color="primary">
                    <AddCircleOutlineIcon />
                </IconButton>
                <Typography sx={{ ml: 2 }}>Adult(s)</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={decrementChildren} disabled={room.children <= 0} color="primary">
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <TextField
                    size="small"
                    value={room.children}
                    inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
                    sx={{ width: '60px', mx: 1 }}
                />
                <IconButton onClick={incrementChildren} disabled={room.children >= 3} color="primary">
                    <AddCircleOutlineIcon />
                </IconButton>
                <Typography sx={{ ml: 2 }}>Enfants</Typography>
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
            <Typography variant="body1">Prix de chambre : {room.prix.toFixed(2)} DT</Typography>
        </Box>
    );
};

const ReservationModal = ({ isOpen, onRequestClose, offreId, prix, remise,nombre_enfants_gratuits,age_limit_gratuite, type, isAdherant, debut , fin ,details,prix_enfants_payants}) => {
  const calculateDaysMultiplier = (start, end) => {
    if (!start || !end) return 1;
    const diffDays = (end - start) / (1000 * 3600 * 24) + 1; // Add 1 to include both start and end day
    return Math.max(1, diffDays - 1); // Multiplier is (days - 1), minimum is 1
};

   const calculateRoomPrice = (adults, children, basePrice, isAdherant) => {
    let priceIncrease = 0;
    if (adults > 1) {
        priceIncrease += (adults - 1) * (basePrice * 0.4);
    }

    // Calculate the number of children that are not free
    const chargeableChildren = Math.max(0, children - nombre_enfants_gratuits);
    priceIncrease += chargeableChildren * prix_enfants_payants;

    let totalCost = basePrice + priceIncrease;

    if (isAdherant) {
        totalCost *= (1 - remise / 100);
    }

    return totalCost;
};

    const initialRoomPrice = calculateRoomPrice(1, 0, prix, isAdherant);

    const [userInfo, setUserInfo] = useState(null);
    const [rooms, setRooms] = useState([{ id: 1, adults: 1, children: 0, prix: initialRoomPrice }]);
    const today = new Date();
    const [reservationStart, setReservationStart] = useState();
    const [reservationEnd, setReservationEnd] = useState();
    const [nombre, setNombre] = useState(1);
    
    useEffect(() => {
      if (type === 'voyage' && debut) {
          const startDate = new Date(debut);
          const endDate = new Date(startDate.getTime() + details.nbr_jours * 24 * 60 * 60 * 1000);
          setReservationStart(startDate);
          setReservationEnd(endDate);
      }
  }, [type, debut]);

  const handleStartDateChange = (date) => {
      setReservationStart(date);
      if (type === 'voyage' && date) {
          const endDate = new Date(date.getTime() + details.nbr_jours * 24 * 60 * 60 * 1000);
          setReservationEnd(endDate);
      }
  };

  const handleEndDateChange = (date) => {
      setReservationEnd(date);
  };

  const [daysMultiplier, setDaysMultiplier] = useState(1);
  
    useEffect(() => {
      const newDaysMultiplier  = calculateDaysMultiplier(reservationStart, reservationEnd);
      setDaysMultiplier(newDaysMultiplier);
  }, [reservationStart, reservationEnd, prix, remise, isAdherant]);

    useEffect(() => {
        const token = localStorage.getItem('login');
        const storedUserId = JSON.parse(localStorage.getItem('userId'));

        if (token && storedUserId) {
            const fetchUserData = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:5000/profil/${storedUserId}`,
                        { headers: { Authorization: `Bearer ${JSON.parse(token).token}` } }
                    );
                    setUserInfo(response.data.user);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            };
            fetchUserData();
        }
    }, []);

    const handleAddRoom = () => {
        const newRoomId = rooms.length ? rooms[rooms.length - 1].id + 1 : 1;
        const newRoom = { id: newRoomId, adults: 1, children: 0, prix: calculateRoomPrice(1, 0, prix, isAdherant) };
        setRooms([...rooms, newRoom]);
    };

    const handleRemoveRoom = (roomId) => {
        setRooms(rooms.filter(room => room.id !== roomId).map((room, index) => ({ ...room, id: index + 1 })));
    };

    const updateRoom = (roomId, field, value) => {
        const room = rooms.find(room => room.id === roomId);
        const updatedRoom = { ...room, [field]: value };
        updatedRoom.prix = calculateRoomPrice(updatedRoom.adults, updatedRoom.children, prix, isAdherant);
        setRooms(rooms.map(room => room.id === roomId ? updatedRoom : room));
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
   }, 2000); // Remove the alert after 3 seconds
 };

    const handleReservation = async () => {
      if (
        !modePaiement ||
        (modePaiement === 'deduction_salaire' && !autorisationDeductionSalaire)
      ) {
        let alertMessage = '';
        if (!modePaiement) {
          alertMessage = 'Veuillez sélectionner le mode de paiement.';
        } else {
          alertMessage = 'Veuillez autoriser la déduction sur votre salaire.';
        }
        showAlert(alertMessage, 'red'); // Utilisation de showAlert au lieu de alert
        return;
      }
      
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        let reservationStartAdjusted = reservationStart;
  let reservationEndAdjusted = reservationEnd;

  if (type === 'hotel') {
    // Add one day to reservationStart and reservationEnd
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
                }))
              : [],
          nombre: type !== 'hotel' ? nombre : rooms.length,
          typeR: type,
          prix_totale:
            type === 'hotel'
              ? rooms.reduce((acc, room) => acc + room.prix, 0).toFixed(2)
              : (nombre * calculateRoomPrice(1, 0, prix, isAdherant)).toFixed(
                  2
                ),
           date_debut: reservationStartAdjusted.toISOString(),
           date_fin: type === 'activite' ? null : reservationEndAdjusted.toISOString(),
           mode_paiement: modePaiement, // Include payment mode
          autorisation_deduction_salaire: autorisationDeductionSalaire,
          statut_paiement: "", // Set statut_paiement based on payment mode
          montant_deduit: "",
        };

        try {
            await axios.post(
                'http://localhost:5000/reservation',
                reservationData,
                { headers: { 'Authorization': `Bearer ${token}` } }
                
            );
         

            console.log("Reservation successful");
                 window.location.href = '/mesreservations';

             
            onRequestClose();
            
        } catch (error) {
            console.error("Reservation failed:", error.response?.data || error.message);
        }
    };

    const incrementNombre = () => setNombre(nombre + 1);
    const decrementNombre = () => setNombre(Math.max(1, nombre - 1));
    const isDateSelected = reservationStart && reservationEnd;



    return (
      <Dialog open={isOpen} onClose={onRequestClose} maxWidth="sm" fullWidth>
        <DialogTitle>Reservation Details</DialogTitle>
        <DialogContent dividers>
          {userInfo && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={
                  userInfo.photo
                    ? `http://localhost:5000/${userInfo.photo}`
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
                color: 'error.main', // Couleur pour les remises
                fontSize: '1rem',
                '&:hover': {
                  color: 'error.dark', // Assombrir la couleur au survol
                },
              }}
            >
              Remise d'Adhésion Club22: {remise}%
            </Typography>
          )}
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: 'bold',
              color: '#555',
              '&:hover': {
                color: '#555', // Changement de couleur au survol
              },
              fontSize: '1.25rem', // Taille de la police
            }}
          >
            Prix: {prix.toFixed(2)} DT
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: 'bold',
              marginBottom:'10px',
              color: '#555',
              '&:hover': {
                color: '#555', // Changement de couleur au survol
              },
              fontSize: '1.25rem', // Taille de la police
            }}
          >
            DATE DE RESERVATION :{' '}
          </Typography>
          
          {type === 'hotel' && (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns} locale={fr}>
                {' '}
                <MobileDatePicker
                  label="Arrivée"
                  value={reservationStart}
                  onChange={handleStartDateChange}
                  minDate={today}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="jj/mm/aaaa"
                      fullWidth
                      error={!reservationStart}
                      helperText={
                        !reservationStart ? 'Sélection obligatoire' : ''
                      }
                    />
                  )}
                />
                <MobileDatePicker
                  label="Départ"
                  value={reservationEnd}
                  onChange={handleEndDateChange}
                  minDate={addDays(reservationStart, 1)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="jj/mm/aaaa"
                      fullWidth
                      error={!reservationEnd}
                      helperText={
                        !reservationEnd ? 'Sélection obligatoire' : ''
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
                  label="Départ"
                  value={reservationStart}
                  onChange={handleStartDateChange}
                  minDate={today}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="jj/mm/aaaa"
                      fullWidth
                      error={!reservationStart}
                      helperText={
                        !reservationStart ? 'Sélection obligatoire' : ''
                      }
                    />
                  )}
                />
                <MobileDatePicker
                  label="Retour"
                  value={reservationEnd}
                  onChange={handleEndDateChange}
                  minDate={reservationStart}
                  disabled={type === 'voyage'} // Disable the field if type is 'voyage'
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="jj/mm/aaaa"
                      fullWidth
                      error={!reservationEnd}
                      helperText={
                        !reservationEnd ? 'Sélection obligatoire' : ''
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
                  label="Date de début"
                  value={reservationStart}
                  onChange={handleStartDateChange}
                  minDate={today}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="jj/mm/aaaa"
                      fullWidth
                      error={!reservationStart}
                      helperText={
                        !reservationStart ? 'Sélection obligatoire' : ''
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
                />
              ))
            ) : (
              <>
                <br></br>
                <TextField
                  label="Nombre des personnes"
                  type="number"
                  InputProps={{
                    endAdornment: (
                      <React.Fragment>
                        <IconButton onClick={decrementNombre}>
                          <RemoveCircleOutlineIcon />
                        </IconButton>
                        <IconButton onClick={incrementNombre}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </React.Fragment>
                    ),
                  }}
                  value={nombre}
                  variant="outlined"
                  fullWidth
                />
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
              Ajouter une chambre
            </Button>
          )}

          <Typography
            variant="h6"
            sx={{
              mt: 2,
              fontWeight: 'medium',
              color: '#555',
              fontSize: '1.15rem',
            }}
          >
            Prix totale:{' '}
            {type === 'hotel'
              ? (
                  rooms.reduce((acc, room) => acc + room.prix, 0) *
                  daysMultiplier
                ).toFixed(2)
              : (nombre * calculateRoomPrice(1, 0, prix, isAdherant)).toFixed(
                  2
                )}{' '}
            DT
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                mt: 2,
                fontWeight: 'bold',
                color: '#555',
                '&:hover': {
                  color: '#555', // Changement de couleur au survol
                },
                fontSize: '1.25rem', // Taille de la police
              }}
            >
              PAIEMENT :
            </Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="mode-paiement-label" sx={{}}>
                Mode de paiement
              </InputLabel>
              <Select
                labelId="mode-paiement-label"
                id="mode-paiement-select"
                value={modePaiement}
                onChange={handlePaymentModeChange}
                fullWidth
                required
                label="Mode de paiement" // Assurez-vous d'ajouter la prop 'label' ici pour que le label se déplace correctement
                sx={{
                  '& .MuiSelect-select': {
                    pl: 2, // Padding à gauche pour le texte
                    pr: 1, // Padding à droite pour l'icône
                  },
                }}
              >
                <MenuItem value="especes">Espèces</MenuItem>
                <MenuItem value="deduction_salaire">
                  Déduction sur le salaire
                </MenuItem>
              </Select>
            </FormControl>
            {modePaiement === 'deduction_salaire' && (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autorisationDeductionSalaire}
                    onChange={handleAuthorizationChange}
                    required
                  />
                }
                label="J'autorise la déduction sur mon salaire pour cette réservation"
                sx={{ mb: 2 }}
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            onClick={onRequestClose}
          >
            Annuler
          </Button>
          <Button
            onClick={handleReservation}
            variant="contained"
            color="secondary"
            disabled={type === 'hotel' && !isDateSelected}
          >
            Réserver
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default ReservationModal;