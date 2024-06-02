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
import { useTranslation } from 'react-i18next';

const ShowReservationDialog = ({ reservation, open, onClose }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {t('Détails de réservation')}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="body2">{t('Employé')}:</Typography>
        <Typography variant="body2">
          {t('Nom et Prénom')}: {reservation.employe.utilisateur.nom}{' '}
          {reservation.employe.utilisateur.prenom}
        </Typography>
        <Typography variant="body2">
          Email: {reservation.employe.utilisateur.email}
        </Typography>
        <Typography variant="body2">
          {t('Téléphone')}: {reservation.employe.utilisateur.tel}
        </Typography>
      </Paper>
      <DialogContent>
        {reservation && (
          <Box>
            <Typography variant="subtitle1">
              {reservation.offre.collaborateur.nom}
            </Typography>
            <Avatar
              src={`http://54.242.240.123/${reservation.offre.collaborateur.logo}`}
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
              {t('Prix')}: {reservation.prix_totale.toFixed(2)} TND
            </Typography>
            <Typography variant="body2">Type: {reservation.typeR}</Typography>
            {reservation.typeR === 'hotel' && (
              <>
                <Typography variant="h5" gutterBottom>
                  {t('Date de réservation')} : {t('De')}{' '}
                  {reservation.date_debut} {t("Jusq'ua")} {reservation.date_fin}
                </Typography>
                <Typography variant="h5" gutterBottom>
                  {t("Nom de l'hotel")}: {reservation.details.nom_hotel}
                </Typography>
                <List>
                  {reservation.rooms.map((room, index) => (
                    <ListItem key={index} divider sx={{ pt: 2, pb: 2 }}>
                      <ListItemText
                        primary={`${t('Chambre')} ${index + 1}:`}
                        secondary={`${t('Adulte(s)')}: ${room.nbr_adults}, ${t(
                          'Enfant(s)'
                        )}: ${room.nbr_enfants}, ${t(
                          'Prix'
                        )}: ${room.prix.toFixed(2)} TND`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {reservation.typeR === 'autre' &&
              ((
                <Typography variant="h5" gutterBottom>
                  {t('Date de réservation')} : {t('De')}{' '}
                  {reservation.date_debut} {t("Jusq'ua")} {reservation.date_fin}
                </Typography>
              ),
              (
                <Typography variant="body2">
                  {t('Nombres de personnes')}: {reservation.nombre}
                </Typography>
              ))}
            {reservation.typeR === 'voyage' && (
              <>
                <Typography variant="h5" gutterBottom>
                  {t('Date de réservation')} : {t('De')}{' '}
                  {reservation.date_debut} {t("Jusq'ua")} {reservation.date_fin}
                </Typography>
                <Typography variant="body2">
                  {t('Nombre de jours')}: {reservation.details.nbr_jours}
                </Typography>
                <Typography variant="body2">
                  {t('Nombres de personnes')}: {reservation.nombre}{' '}
                </Typography>
                <Typography variant="body2">
                  {t('Inclus')}: {reservation.details.inclus}
                </Typography>
              </>
            )}
            {reservation.typeR === 'activité' && (
              <>
                <Typography variant="h5" gutterBottom>
                  {t('Date de réservation')} : {reservation.date_debut}
                </Typography>
                <Typography variant="body2">
                  {t('Durée')}: {reservation.details.duree} {t('heures')}
                </Typography>
                <Typography variant="body2">
                  {t('Inclus')}: {reservation.details.inclus}
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
                  src={`http://54.242.240.123/${image}`}
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
          {t('Fermer')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowReservationDialog;
