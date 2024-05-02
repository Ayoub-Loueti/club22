import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, IconButton, TextField
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const RoomDetails = ({ roomNumber, room, updateRoom, deleteRoom, canDelete, adherent, remise }) => {
  const incrementAdults = () => updateRoom(room.id_hotel, 'nbr_adults', room.nbr_adults + 1);
  const decrementAdults = () => updateRoom(room.id_hotel, 'nbr_adults', Math.max(1, room.nbr_adults - 1));
  const incrementChildren = () => updateRoom(room.id_hotel, 'nbr_enfants', room.nbr_enfants + 1);
  const decrementChildren = () => updateRoom(room.id_hotel, 'nbr_enfants', Math.max(0, room.nbr_enfants - 1));

  return (
    <Box sx={{ mb: 2, bgcolor: 'background.paper', p: 2, borderRadius: 'borderRadius', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" gutterBottom component="div">
          Chambre {roomNumber}
        </Typography>
        {canDelete && (
          <IconButton onClick={() => deleteRoom(room.id_hotel)} color="error">
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={decrementAdults} disabled={room.nbr_adults <= 1} color="primary">
          <RemoveCircleOutlineIcon />
        </IconButton>
        <TextField
          size="small"
          value={room.nbr_adults}
          inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
          sx={{ width: '60px', mx: 1 }}
        />
        <IconButton onClick={incrementAdults} color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
        <Typography sx={{ ml: 2 }}>Adult(s)</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={decrementChildren} disabled={room.nbr_enfants <= 0} color="primary">
          <RemoveCircleOutlineIcon />
        </IconButton>
        <TextField
          size="small"
          value={room.nbr_enfants}
          inputProps={{ readOnly: true, style: { textAlign: 'center' } }}
          sx={{ width: '60px', mx: 1 }}
        />
        <IconButton onClick={incrementChildren} color="primary">
          <AddCircleOutlineIcon />
        </IconButton>
        <Typography sx={{ ml: 2 }}>Enfants</Typography>
      </Box>
      <Typography variant="body1">Prix de chambre : {room.prix.toFixed(2)} DT</Typography>
    </Box>
  );
};

const ModifyReservation = ({ isOpen, onRequestClose, reservationData }) => {
  const [rooms, setRooms] = useState(reservationData.rooms || []);
  const [deletedRooms, setDeletedRooms] = useState([]);
  const [nombre, setNombre] = useState(reservationData.nombre || 1);
  const [prixTotal, setPrixTotal] = useState(reservationData.prix_totale);
  const token = localStorage.getItem('login');
  const adherent = reservationData.employe.adherant;
  const remise = reservationData.offre.remise / 100;

  useEffect(() => {
    // Update total price whenever rooms or deletedRooms change
    updateTotalPrice(rooms);
  }, [rooms, deletedRooms]);

  const calculateRoomPrice = (adults, children, basePrice) => {
    let priceIncrease = (adults - 1) * (basePrice * 0.4) + children * (basePrice * 0.2);
    let totalPrice = basePrice + priceIncrease;
    if (adherent) {
      totalPrice *= (1 - remise);
    }
    return totalPrice;
  };

  const updateRoom = (roomId, field, value) => {
    const updatedRooms = rooms.map(room => {
      if (room.id_hotel === roomId) {
        const newRoom = { ...room, [field]: value };
        newRoom.prix = calculateRoomPrice(newRoom.nbr_adults, newRoom.nbr_enfants, reservationData.offre.prix);
        return newRoom;
      }
      return room;
    });
    setRooms(updatedRooms);
    updateTotalPrice(updatedRooms);
  };

  const deleteRoom = (roomId) => {
    const updatedRooms = rooms.filter(room => room.id_hotel !== roomId);
    const deletedRoom = rooms.find(room => room.id_hotel === roomId);
    setRooms(updatedRooms);
    setDeletedRooms([...deletedRooms, deletedRoom]); // Add the deleted room to deletedRooms
  };

  const updateTotalPrice = (updatedRooms) => {
    const newTotalPrice = updatedRooms.reduce((acc, room) => acc + room.prix, 0);
    setPrixTotal(newTotalPrice);
  };

  const handleSaveChanges = async () => {
    const updatedRooms = rooms.map(room => ({
      id_hotel: room.id_hotel,
      nbr_adults: room.nbr_adults,
      nbr_enfants: room.nbr_enfants,
      prix: room.prix
    }));
  
    const updatedData = {
      nombre: nombre,
      prix_totale: prixTotal,
      hotels: updatedRooms
    };
  
    try {
      // Delete any rooms marked for deletion
      await Promise.all(deletedRooms.map(async deletedRoom => {
        await axios.delete(`http://localhost:5000/hotel/${deletedRoom.id_hotel}`, {
          headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
        });
      }));
  
      // Update the reservation with the modified data
      const response = await axios.put(`http://localhost:5000/updateReservation/${reservationData.id_reservation}`, updatedData, {
        headers: { Authorization: `Bearer ${JSON.parse(token).token}` },
      });
Swal.fire(
  'Mis à jour !',
  'Votre réservation a été mise à jour avec succès.',
  'success'
);
      onRequestClose();  // Assuming this method closes the dialog
    } catch (error) {
Swal.fire('Échec !', 'Échec de la mise à jour de la réservation.', 'error');
      console.error('Failed to update reservation:', error);
    }
  };
  

  return (
    <Dialog open={isOpen} onClose={onRequestClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modifier Réservation</DialogTitle>
      <DialogContent>
        {reservationData.typeR === 'hotel' ? (
          rooms.map((room, index) => (
            <RoomDetails
              key={index}
              roomNumber={index + 1}
              room={room}
              updateRoom={updateRoom}
              deleteRoom={deleteRoom}
              canDelete={rooms.length > 1}
              adherent={adherent}
              remise={remise}
            />
          ))
        ) : (
          <>
          <br />
          <TextField
            label="Nombre des personnes"
            type="number"
            fullWidth
            variant="outlined"
            value={nombre}
            onChange={(e) => {
              setNombre(Number(e.target.value));
              setPrixTotal(Number(e.target.value) * reservationData.offre.prix * (adherent ? (1 - remise) : 1));
            }}
          />
          </>
        )}
      </DialogContent>
      <Typography variant="h6" sx={{ mt: 2 }}>&nbsp;&nbsp;&nbsp;&nbsp;Prix totale: {prixTotal.toFixed(2)} DT</Typography>
      <DialogActions>
        <Button onClick={onRequestClose}>Annuler</Button>
        <Button onClick={handleSaveChanges} color="primary">Enregistrer</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyReservation;
