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
  ListItemText,
  Paper,
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
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="body2">Employé:</Typography>
        <Typography variant="body2">
          Nom et Prénom: {reservation.employe.utilisateur.nom}{' '}
          {reservation.employe.utilisateur.prenom}
        </Typography>
        <Typography variant="body2">
          Email: {reservation.employe.utilisateur.email}
        </Typography>
        <Typography variant="body2">
          Téléphone: {reservation.employe.utilisateur.tel}
        </Typography>
      </Paper>
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
            </Typography>{' '}
            <Box
              sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}
            ></Box>
            <Typography variant="body2">
              Prix: {reservation.prix_totale.toFixed(2)} DT
            </Typography>
            <Typography variant="body2">Type: {reservation.typeR}</Typography>
            {reservation.typeR === 'hotel' && (
              <>
                <Typography variant="h5" gutterBottom>
                  Date de réservation : De {reservation.date_debut} Jusq'ua{' '}
                  {reservation.date_fin}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  Nom de l'hotel: {reservation.details.nom_hotel}
                </Typography>
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
              </>
            )}
            {reservation.typeR === 'autre' &&
              ((
                <Typography variant="h5" gutterBottom>
                  Date de réservation : De {reservation.date_debut} Jusq'ua{' '}
                  {reservation.date_fin}
                </Typography>
              ),
              (
                <Typography variant="body2">
                  Nombres de personnes: {reservation.nombre}
                </Typography>
              ))}
            {reservation.typeR === 'voyage' && (
              <>
                <Typography variant="h5" gutterBottom>
                  Date de réservation : De {reservation.date_debut} Jusq'ua{' '}
                  {reservation.date_fin}
                </Typography>
                <Typography variant="body2">
                  Nombre de jours: {reservation.details.nbr_jours}
                </Typography>
                <Typography variant="body2">
                  Nombre de personnes: {reservation.nombre}{' '}
                </Typography>
                <Typography variant="body2">
                  Inclus: {reservation.details.inclus}
                </Typography>
              </>
            )}
            {reservation.typeR === 'activité' && (
              <>
                <Typography variant="h5" gutterBottom>
                  Date de réservation :  {reservation.date_debut} 
                </Typography>
                <Typography variant="body2">
                  Durée: {reservation.details.duree} heures
                </Typography>
                <Typography variant="body2">
                  Inclus: {reservation.details.inclus}
                </Typography>
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
