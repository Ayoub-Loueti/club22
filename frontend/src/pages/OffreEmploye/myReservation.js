import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import ShowReservationDialog from './ShowReservationDialog'; // Import the dialog component
import ModifyReservation from './ModifyReservation'; // Import the ModifyReservation component
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [boxDReservations, setBoxDReservations] = useState([]);
    const [boxTReservations, setBoxTReservations] = useState([]);
    const [error, setError] = useState('');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
    const [ratings, setRatings] = useState({});
    const currentDate = new Date();
    
    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        
        const fetchReservations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/myReservations', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setReservations(response.data);
            } catch (err) {
                setError('An error occurred while fetching reservations.');
                console.error('Error fetching reservations:', err);
            }
        };

        const fetchBoxDReservations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/myReservationsBoxD', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBoxDReservations(response.data);
            } catch (err) {
                console.error('Error fetching BoxD reservations:', err);
            }
        };

        const fetchBoxTReservations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/myReservationsBoxT', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBoxTReservations(response.data);
                response.data.forEach(reservation => {
                    fetchRating(token, reservation.offre.id_offre);
                });
            } catch (err) {
                console.error('Error fetching BoxT reservations:', err);
            }
        };

        fetchReservations();
        fetchBoxDReservations();
        fetchBoxTReservations();
    }, []);

    const confirmReservation = async (event, id) => {
        event.stopPropagation();
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            const result = await Swal.fire({
              title: 'Êtes-vous sûr(e) ?',
              text: 'Voulez-vous confirmer cette réservation ?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Oui, confirmer !',
              cancelButtonText: 'Non, annuler !',
              reverseButtons: true,
            });
            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/reservation/${id}/confirmer`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
Swal.fire('Confirmé !', 'La réservation a été confirmée.', 'success');
                setReservations(reservations.map(r => r.id_reservation === id ? { ...r, etat: 'confirmed' } : r));
            }
        } catch (err) {
Swal.fire(
  'Échec !',
  "Une erreur s'est produite lors de la confirmation de la réservation.",
  'error'
);
        }
    };

    const cancelReservation = async (event, id) => {
        event.stopPropagation();
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            const result = await Swal.fire({
              title: 'Êtes-vous sûr(e) ?',
              text: 'Voulez-vous annuler cette réservation ?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Oui, annuler',
              cancelButtonText: 'Non, la garder',
              reverseButtons: true,
            });
            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/reservation/${id}/annuler`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
Swal.fire('Annulé !', 'La réservation a été annulée.', 'success');
                setReservations(reservations.map(r => r.id_reservation === id ? { ...r, etat: 'cancelled' } : r));
            }
        } catch (err) {
Swal.fire(
  'Échec !',
  "Une erreur s'est produite lors de l'annulation de la réservation.",
  'error'
);
        }
    };

    const handleOpenDialog = (reservation) => {
        setSelectedReservation(reservation);
        setShowDialog(true);
    };
    
    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleModifyDialogOpen = (reservation) => {
        setSelectedReservation(reservation);
        setModifyDialogOpen(true);
    };

    const handleModifyDialogClose = () => {
        setModifyDialogOpen(false);
    };

    const getCardBackgroundColor = (etat) => {
        switch (etat) {
            case 'reparation':
                return '#ADD8E6';
            case 'refuser':
                return '#FF6347';
            case 'accepter':
                return '#70CD32';
            case 'en_cours':
                return '#F4F4F4';
            default:
                return '#F4F4F4';
        }
    };

    const fetchRating = async (token, offreId) => {
        try {
            const response = await axios.get(`http://localhost:5000/evaluation/vote/${offreId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRatings(prevRatings => ({
                ...prevRatings,
                [offreId]: response.data.vote
            }));
        } catch (err) {
            console.error('Error fetching rating:', err);
        }
    };

    const handleRating = (event, id_offre, reservationId, rating) => {
        event.stopPropagation();
        submitVote(id_offre, reservationId, rating);
    };

    const renderStars = (reservation) => {
        const rating = ratings[reservation.offre.id_offre] || 0;
        return (
            <div className="star-rating" style={{ fontSize: '24px' }}>
                {[...Array(5)].map((_, i) => (
                    <span key={i} 
                          style={{ cursor: 'pointer', color: i < rating ? 'gold' : '#ccc' }}
                          onClick={(event) => handleRating(event, reservation.offre.id_offre, reservation.id_reservation, i + 1)}>
                        &#9733;
                    </span>
                ))}
            </div>
        );
    };

    const submitVote = async (id_offre, id_reservation, vote) => {
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            const response = await axios.post('http://localhost:5000/evaluation', {
                id_offre,
                vote,
                id_employe: id_reservation
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setRatings(prev => ({
                    ...prev,
                    [id_offre]: vote
                }));
            }
        } catch (err) {
            console.error('Error submitting vote:', err);
Swal.fire('Failed!', 'Échec de la soumission du vote.', 'error');
        }
    };

const downloadReservationPDF = async (reservation) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  // Define margins and initial positions
  const marginLeft = 40;
  const marginTop = 60;
  const lineHeight = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Adding a colorful header
  pdf.setFillColor(107, 133, 164); // Gold color (#6b85a4)
  pdf.rect(0, 0, pageWidth, 100, 'F');

  // Title: "Carte de réservation"
  pdf.setTextColor(0, 0, 0); // White color for text
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Carte de réservation', marginLeft, marginTop);

  // Right-aligned: "Club22"
  pdf.setFontSize(14);
  pdf.text('Club22', pageWidth - marginLeft, marginTop, 'right');

  // Offer Details Section
  let currentY = marginTop + 35;

  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');   currentY += lineHeight;

  pdf.text(`Offre: ${reservation.offre.titre}`, marginLeft, currentY);   currentY += lineHeight;

   pdf.text(
     `Prix total: ${reservation.prix_totale.toFixed(2)} DT`,
     marginLeft,
     currentY
   );
   if (reservation.offre.remise) {
     currentY += lineHeight;
     pdf.text(`Remise: ${reservation.offre.remise}%`, marginLeft, currentY);
   }
  currentY += lineHeight;
  pdf.text(
    `Description: ${reservation.offre.description}`,
    marginLeft,
    currentY
  );


  switch (reservation.offre.type) {
    case 'hotel':
      currentY += lineHeight;
      pdf.text(
        `Nom de l'hôtel: ${reservation.details.nom_hotel}`,
        marginLeft,
        currentY
      );
      pdf.text(
        `Étoiles: ${'★'.repeat(reservation.details.etoiles)}`,
        marginLeft,
        (currentY += lineHeight)
      );
      // Add other hotel-specific attributes here...
      break;
    case 'voyage':
      currentY += lineHeight;
      pdf.text(
        `Nombre de jours: ${reservation.details.nbr_jours}`,
        marginLeft,
        currentY
      );
      pdf.text(
        `Inclus: ${reservation.details.inclus}`,
        marginLeft,
        (currentY += lineHeight)
      );
      // Add other voyage-specific attributes here...
      break;
    case 'activite':
      currentY += lineHeight;
      pdf.text(
        `Durée: ${reservation.details.duree} heures`,
        marginLeft,
        currentY
      );
      pdf.text(
        `Inclus: ${reservation.details.inclus}`,
        marginLeft,
        (currentY += lineHeight)
      );
      // Add other activite-specific attributes here...
      break;
    default:
      break;
  }

  // Collaborator Details Section
  currentY += lineHeight * 3;
  pdf.setFontSize(16);
  pdf.text(`Détails du collaborateur:`, marginLeft, currentY);
  pdf.setFontSize(12);
  pdf.text(
    `Email: ${reservation.offre.collaborateur.email}`,
    marginLeft,
    (currentY += lineHeight)
  );
  pdf.text(
    `Téléphone: ${reservation.offre.collaborateur.tel}`,
    marginLeft,
    (currentY += lineHeight)
  );
  pdf.text(
    `Adresse: ${reservation.offre.collaborateur.adresse}`,
    marginLeft,
    (currentY += lineHeight)
  );

  // Employee Details Section
  currentY += lineHeight * 2;
  pdf.setFontSize(16);
  pdf.text(`Détails de l'employé:`, marginLeft, currentY);
  pdf.setFontSize(12);
  pdf.text(
    `Nom: ${
      reservation.employe && reservation.employe.utilisateur
        ? reservation.employe.utilisateur.nom
        : 'N/A'
    }`,
    marginLeft,
    (currentY += lineHeight)
  );
  pdf.text(
    `Prénom: ${
      reservation.employe && reservation.employe.utilisateur
        ? reservation.employe.utilisateur.prenom
        : 'N/A'
    }`,
    marginLeft,
    (currentY += lineHeight)
  );
  pdf.text(
    `Email: ${
      reservation.employe && reservation.employe.utilisateur
        ? reservation.employe.utilisateur.email
        : 'N/A'
    }`,
    marginLeft,
    (currentY += lineHeight)
  );


  // Footer: "Club22 Ooredoo"
  pdf.setFontSize(12);
  pdf.setTextColor(25, 31, 67); // Dark blue color (#191f43)
  pdf.text(
    'Club22 Ooredoo',
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 30,
    'center'
  );

  // Save the PDF
  pdf.save('reservation.pdf');
};






    return (
      <>
        <Navbar />
        <NavbarHaut />
        
        {error && (
          <Typography color="error" sx={{ m: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={2} style={{ margin: 20 }}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                   Premiere phase : Vos réservations
                  </Typography>
                  <Card raised sx={{ height: 290, overflowY: 'auto' }}>
                    <CardContent>
                      {reservations.map((reservation) => (
                        <Card
                          key={reservation.id_reservation}
                          variant="outlined"
                          sx={{
                            mb: 2,
                            display: 'flex',
                            backgroundColor: '#F4F4F4',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpenDialog(reservation)}
                        >
                          <Box
                            component="img"
                            sx={{
                              width: 150,
                              height: 'auto',
                              maxWidth: '100%',
                              maxHeight: 150,
                              objectFit: 'cover',
                            }}
                            src={`http://localhost:5000/${reservation.offre.images[0]}`}
                            alt="Offre"
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              flexGrow: 1,
                              padding: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h6">
                                {reservation.offre.titre}
                              </Typography>
                              <Typography variant="body2">
                                {reservation.offre.collaborateur.nom}
                              </Typography>
                              <Typography variant="body1" color="primary">
                                {reservation.prix_totale} TND
                              </Typography>
                              {reservation.etat === 'annuler' && (
                                <Typography
                                  style={{ color: 'red', fontWeight: 'bold' }}
                                >
                                  Reservation annulée
                                </Typography>
                              )}
                            </Box>
                            {reservation.etat === 'en_cours' && (
                              <Box display="flex" justifyContent="flex-end">
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: '#5CA163',
                                    '&:hover': { backgroundColor: '#4B8A50' },
                                    mr: 1,
                                  }}
                                  onClick={(event) =>
                                    confirmReservation(
                                      event,
                                      reservation.id_reservation
                                    )
                                  }
                                >
                                  Confirmer
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: '#E3D97F',
                                    '&:hover': { backgroundColor: '#D0C170' },
                                    mr: 1,
                                  }}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleModifyDialogOpen(reservation);
                                  }}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{
                                    backgroundColor: '#C50F10',
                                    '&:hover': { backgroundColor: '#B00C0E' },
                                  }}
                                  onClick={(event) =>
                                    cancelReservation(
                                      event,
                                      reservation.id_reservation
                                    )
                                  }
                                >
                                  Annuler
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h5" sx={{ mb: 1 }}>
                     Deuxieme Phase: vos réservations confrimés
                  </Typography>
                  <Card raised sx={{ height: 290, overflowY: 'auto' }}>
                    <CardContent>
                      {boxDReservations.map((reservation) => (
                        <Card
                          key={reservation.id_reservation}
                          variant="outlined"
                          sx={{
                            mb: 2,
                            display: 'flex',
                            backgroundColor: getCardBackgroundColor(
                              reservation.etat
                            ),
                            cursor: 'pointer',
                          }}
                          onClick={() => handleOpenDialog(reservation)}
                        >
                          <Box
                            component="img"
                            sx={{
                              width: 150,
                              height: 'auto',
                              maxWidth: '100%',
                              maxHeight: 150,
                              objectFit: 'cover',
                            }}
                            src={`http://localhost:5000/${reservation.offre.images[0]}`}
                            alt="Offre"
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              flexGrow: 1,
                              padding: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h6">
                                {reservation.offre.titre}
                              </Typography>
                              <Typography variant="body2">
                                {reservation.offre.collaborateur.nom}
                              </Typography>
                              <Typography variant="body1" color="primary">
                                {reservation.prix_totale} TND
                              </Typography>
                              {reservation.etat === 'reparation' && (
                                <Typography
                                  style={{ color: 'red', fontWeight: 'bold' }}
                                >
                                  Demande envoyée au collaborateur
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                Resultat du demande
              </Typography>
              <Card raised sx={{ height: 670, overflowY: 'auto' }}>
                <CardContent>
                  {boxTReservations.map((reservation) => (
                    <Card
                      id={`reservation-card-${reservation.id_reservation}`}
                      key={reservation.id_reservation}
                      variant="outlined"
                      sx={{
                        mb: 2,
                        display: 'flex',
                        backgroundColor: getCardBackgroundColor(
                          reservation.etat
                        ),
                        cursor: 'pointer',
                      }}
                      onClick={() => handleOpenDialog(reservation)}
                    >
                      <Box
                        component="img"
                        sx={{
                          width: 150,
                          height: 'auto',
                          maxWidth: '100%',
                          maxHeight: 150,
                          objectFit: 'cover',
                        }}
                        src={`http://localhost:5000/${reservation.offre.images[0]}`}
                        alt="Offre"
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          flexGrow: 1,
                          padding: 2,
                        }}
                      >
                        <Typography variant="h6">
                          {reservation.offre.titre}
                        </Typography>
                        <Typography variant="body2">
                          {reservation.offre.collaborateur.nom}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {reservation.prix_totale} TND
                        </Typography>
                        {reservation.etat === 'accepter' && new Date(currentDate.toISOString().split('T')[0]) > new Date(reservation.date_debut) && (
                         <>
                        {renderStars(reservation)}
                        </>
                        )}
                        {reservation.etat === 'accepter' && (
                          <>
                            
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                downloadReservationPDF(reservation);
                              }}
                              color="primary"
                            >
                              <FontAwesomeIcon icon={faDownload} />
                            </Button>
                          </>
                        )}
                      </Box>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {selectedReservation && (
            <>
              <ShowReservationDialog
                reservation={selectedReservation}
                open={showDialog}
                onClose={handleCloseDialog}
              />
              <ModifyReservation
                isOpen={modifyDialogOpen}
                onRequestClose={handleModifyDialogClose}
                reservationData={selectedReservation}
              />
            </>
          )}
        </Grid>
      </>
    );
};

export default MyReservations;
