import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  Typography, Box, IconButton, TextField
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

const RoomDetails = ({ room, updateRoom, deleteRoom, canDelete }) => {
  const incrementAdults = () => updateRoom(room.id, 'adults', room.adults + 1);
  const decrementAdults = () => updateRoom(room.id, 'adults', Math.max(1, room.adults - 1));
  const incrementChildren = () => updateRoom(room.id, 'children', room.children + 1);
  const decrementChildren = () => updateRoom(room.id, 'children', Math.max(0, room.children - 1));

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

const ModifyReservation = ({ isOpen, onRequestClose, reservationData }) => {
  const [rooms, setRooms] = useState(reservationData.rooms || []);
  const [nombre, setNombre] = useState(reservationData.nombre || 1);

  const updateRoom = (roomId, field, value) => {
    const updatedRooms = rooms.map(room => {
      if (room.id === roomId) {
        return { ...room, [field]: value };
      }
      return room;
    });
    setRooms(updatedRooms);
  };

  const deleteRoom = (roomId) => {
    const filteredRooms = rooms.filter(room => room.id !== roomId);
    setRooms(filteredRooms);
  };

  const handleSaveChanges = async () => {
    const updatedData = {
      nombre: nombre,
      rooms: rooms,
      // Calculating total price
      prix_totale: rooms.reduce((acc, room) => acc + room.prix, 0)
    };

    try {
      const response = await axios.put(`http://localhost:5000/reservation/${reservationData.id}`, updatedData);
      console.log('Update successful:', response.data);
      onRequestClose();
    } catch (error) {
      console.error('Failed to update reservation:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onRequestClose} maxWidth="sm" fullWidth>
      <DialogTitle>Modify Reservation</DialogTitle>
      <DialogContent>
        {reservationData.typeR === 'hotel' ? (
          rooms.map((room, index) => (
            <RoomDetails
              key={index}
              room={room}
              updateRoom={updateRoom}
              deleteRoom={deleteRoom}
              canDelete={rooms.length > 1}
            />
          ))
        ) : (
          <TextField
            label="Nombre des personnes"
            type="number"
            fullWidth
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(Number(e.target.value))}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onRequestClose}>Cancel</Button>
        <Button onClick={handleSaveChanges} color="primary">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModifyReservation;
