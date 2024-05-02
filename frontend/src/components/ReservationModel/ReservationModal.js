import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton, Avatar, TextField } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const RoomDetails = ({ room, updateRoom, deleteRoom, canDelete }) => {
    const incrementAdults = () => {
        updateRoom(room.id, 'adults', room.adults + 1);
    };

    const decrementAdults = () => {
        updateRoom(room.id, 'adults', Math.max(1, room.adults - 1));
    };

    const incrementChildren = () => {
        updateRoom(room.id, 'children', room.children + 1);
    };

    const decrementChildren = () => {
        updateRoom(room.id, 'children', Math.max(0, room.children - 1));
    };

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
            </Box>
            <Typography variant="body1">Prix de chambre : {room.prix.toFixed(2)} DT</Typography>
        </Box>
    );
};

const ReservationModal = ({ isOpen, onRequestClose, offreId, prix, remise, type, isAdherant, debut , fin }) => {
  const calculateDaysMultiplier = (start, end) => {
    if (!start || !end) return 1;
    const diffDays = (end - start) / (1000 * 3600 * 24) + 1; // Add 1 to include both start and end day
    return Math.max(1, diffDays - 1); // Multiplier is (days - 1), minimum is 1
};

    const calculateRoomPrice = (adults, children, basePrice, isAdherant, daysMultiplier) => {
        let priceIncrease = 0;
        if (adults > 1) {
            priceIncrease += (adults - 1) * (basePrice * 0.4);
        }
        priceIncrease += children * (basePrice * 0.2);
        let totalCost = basePrice + priceIncrease;
        if (type === 'hotel') {
          totalCost *= daysMultiplier;
      }
        if (isAdherant) {
            totalCost *= (1 - remise / 100);
        }

        return totalCost;
    };

    const initialRoomPrice = calculateRoomPrice(1, 0, prix, isAdherant);

    const [userInfo, setUserInfo] = useState(null);
    const [rooms, setRooms] = useState([{ id: 1, adults: 1, children: 0, prix: initialRoomPrice }]);
    const [nombre, setNombre] = useState(1);
    const [reservationStart, setReservationStart] = useState();
    const [reservationEnd, setReservationEnd] = useState();

    useEffect(() => {
      const daysMultiplier = calculateDaysMultiplier(reservationStart, reservationEnd);
      const updatedRooms = rooms.map(room => ({
          ...room,
          prix: calculateRoomPrice(room.adults, room.children, prix, isAdherant, daysMultiplier)
      }));
      setRooms(updatedRooms);
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

    const handleReservation = async () => {
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        const reservationData = {
            id_offre: offreId,
            hotels: type === 'hotel' ? rooms.map(room => ({
                id: room.id,
                nbr_adults: room.adults,
                nbr_enfants: room.children,
                prix: room.prix
            })) : [],
            nombre: type !== 'hotel' ? nombre : rooms.length,
            typeR: type ,
            prix_totale: type === 'hotel' ? rooms.reduce((acc, room) => acc + room.prix, 0).toFixed(2) : (nombre * calculateRoomPrice(1, 0, prix, isAdherant)).toFixed(2),
            date_debut: type === 'hotel' ? reservationStart.toISOString() : null ,
            date_fin: type === 'hotel' ? reservationEnd.toISOString() : null ,
          };

        try {
            await axios.post(
                'http://localhost:5000/reservation',
                reservationData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            console.log("Reservation successful");
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
          <Typography variant="h6" sx={{ mt: 2 }}>
            Prix: {prix.toFixed(2)} DT
          </Typography>
          {type === 'hotel' && (
            <>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  label="Date de début"
                  value={reservationStart}
                  onChange={setReservationStart}
                  minDate={new Date(debut)}
                  maxDate={new Date(fin)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="jj/mm/aaaa" 
                      fullWidth 
                      error={!reservationStart} 
                      helperText={!reservationStart ? "Sélection obligatoire" : ""}
                    />
                  )}
                />
                <MobileDatePicker
                  label="Date de fin"
                  value={reservationEnd}
                  onChange={setReservationEnd}
                  minDate={new Date(debut)}
                  maxDate={new Date(fin)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      placeholder="jj/mm/aaaa" 
                      fullWidth 
                      error={!reservationEnd} 
                      helperText={!reservationEnd ? "Sélection obligatoire" : ""}
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
          {remise > 0 && (
            <Typography variant="h6" sx={{ mt: 1 }}>
              Remise si tu es adhérant: {remise}%
            </Typography>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Prix totale:{' '}
            {type === 'hotel'
              ? rooms.reduce((acc, room) => acc + room.prix, 0).toFixed(2)
              : (nombre * calculateRoomPrice(1, 0, prix, isAdherant)).toFixed(
                  2
                )}{' '}
            DT
          </Typography>
          {type === 'hotel' && (
            <Button
              startIcon={<AddCircleOutlineIcon />}
              onClick={handleAddRoom}
              sx={{ mt: 2 }}
            >
              Ajouter une chambre
            </Button>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onRequestClose}>Annuler</Button>
          <Button
            onClick={handleReservation}
            variant="contained"
            color="primary"
            disabled={type === 'hotel' && !isDateSelected}
            >
            Reserve
          </Button>
        </DialogActions>
      </Dialog>
    );
};

export default ReservationModal;