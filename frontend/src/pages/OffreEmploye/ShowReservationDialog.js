import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Avatar,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ShowReservationDialog = ({ reservation, open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Détails de réservation
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {reservation && (
          <Box>
            <Typography variant="subtitle1">
              {reservation.offre.collaborateur.nom}
            </Typography>
            <Avatar
              src={`http://localhost:5000/${reservation.offre.collaborateur.logo}`}
              alt={reservation.offre.collaborateur.nom}
              sx={{ marginRight: 2 }}
            />

            <Typography variant="h5" gutterBottom>
              {reservation.offre.titre}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {reservation.offre.destination}
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
            ></Box>
            <Typography variant="body2">
              Prix: {reservation.prix_totale.toFixed(2)} DT
            </Typography>
            <Typography variant="body2">Type: {reservation.typeR}</Typography>

            {reservation.typeR === 'hotel' && (
              <List>
                {reservation.rooms.map((room, index) => (
                  <ListItem key={index} divider sx={{ pt: 2, pb: 2 }}>
                    <ListItemText
                      primary={`Chambre ${index + 1}:`}
                      secondary={`Adultes: ${room.nbr_adults}, Enfants: ${
                        room.nbr_enfants
                      }, Prix: ${room.prix.toFixed(2)} DT`}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {reservation.typeR === 'autre' && (
              <Typography variant="body2">
                Nombres de personnes: {reservation.nombre}
              </Typography>
            )}

            {reservation.typeR === 'voyage' && (
              <>
                <Typography variant="body2">
                  Nombre de jours: {reservation.offre.details.nbr_jours}
                </Typography>
                <Typography variant="body2">
                  Inclus: {reservation.offre.details.inclus}
                </Typography>
                {/* Ajoutez d'autres détails spécifiques au voyage ici */}
              </>
            )}

            {reservation.typeR === 'activite' && (
              <>
                <Typography variant="body2">
                  Durée: {reservation.offre.details.duree} heures
                </Typography>
                <Typography variant="body2">
                  Inclus: {reservation.offre.details.inclus}
                </Typography>
                {/* Ajoutez d'autres détails spécifiques à l'activité ici */}
              </>
            )}
            <Box
              sx={{
                width: 150,
                height: 'auto',
                maxWidth: '100%',
                maxHeight: 150,
                objectFit: 'cover',
              }}
            >
              {reservation.offre.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/${image}`}
                  alt="Offer"
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    borderRadius: '4px',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowReservationDialog;
