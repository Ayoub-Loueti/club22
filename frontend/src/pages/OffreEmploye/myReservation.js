import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Card, CardContent, Typography, Button, Box,Modal, Backdrop, Fade  } from '@mui/material';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import ShowReservationDialog from './ShowReservationDialog'; // Import the dialog component
import ModifyReservation from './ModifyReservation'; // Import the ModifyReservation component
import jsPDF from 'jspdf';
import QRCode from 'qrcode';


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
    const [showModal, setShowModal] = useState(false);
    const [deductionDetails, setDeductionDetails] = useState([]);
    const token = JSON.parse(localStorage.getItem('login'))?.token;

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
   const fetchReservations = async () => {
     try {
       const response = await axios.get(
         'http://localhost:5000/myReservations',
         {
           headers: { Authorization: `Bearer ${token}` },
         }
       );
       setReservations(response.data);
     } catch (err) {
       setError('An error occurred while fetching reservations.');
       console.error('Error fetching reservations:', err);
     }
   };
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
            await axios.put(
              `http://localhost:5000/reservation/${id}/confirmer`,
              {},
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            Swal.fire(
              'Confirmé !',
              'La réservation a été confirmée.',
              'success'
            );
            setReservations(
              reservations.filter((r) => r.id_reservation !== id)
            );
            const confirmedReservation = reservations.find(
              (r) => r.id_reservation === id
            );
            setBoxDReservations([
              ...boxDReservations,
              { ...confirmedReservation, etat: 'confirmed' },
            ]);
          }
        } catch (err) {
Swal.fire(
  'Échec !',
  "Une erreur s'est produite lors de la confirmation de la réservation.",
  'error'
);
        }
    };
const handleReservationUpdated = (updatedReservation) => {
  setReservations((prevReservations) =>
    prevReservations.map((reservation) =>
      reservation.id_reservation === updatedReservation.id_reservation
        ? { ...reservation, ...updatedReservation }
        : reservation
    )
  );
  setModifyDialogOpen(false); // Fermer le dialogue après la mise à jour
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
fetchReservations();

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
                return '#ffbeae';
            case 'accepter':
                return '#d3f8dc';
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

  // Marges et positions initiales
  const marginLeft = 40;
  const lineHeight = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();

  // En-tête coloré
  pdf.setFillColor(107, 133, 164); // Couleur bleu
  pdf.rect(0, 0, pageWidth, 100, 'F');

  // Titre: "Carte de réservation"
  pdf.setTextColor(255, 255, 255); // Couleur du texte blanc pour le titre
  pdf.setFontSize(22);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Carte de réservation', marginLeft, 80);

  // Aligné à droite: "Club22"
  pdf.setFontSize(14);
  pdf.text('Club22', pageWidth - marginLeft, 80, 'right');

  // Réinitialisation de la couleur pour les autres textes
  pdf.setTextColor(0, 0, 0); // Noir pour le texte suivant

  let currentY = 150; // Début des détails plus bas
  pdf.setDrawColor(0, 0, 0); // Noir pour la ligne de séparation
  currentY += 10;
  pdf.line(marginLeft, currentY, pageWidth - marginLeft, currentY);

  // Section des détails de l'offre
  currentY += lineHeight;
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(150, 150, 150); // Gris pour les titres des sections
  currentY -= 5;
  pdf.text(`Détails de l'offre:`, marginLeft, currentY - lineHeight); // Titre juste au-dessus de la ligne
  currentY += lineHeight; // Décalage vers le bas pour les détails

  pdf.setTextColor(0, 0, 0); // Noir pour les détails
  pdf.text(`Offre: ${reservation.offre.titre}`, marginLeft, currentY);
  currentY += lineHeight;

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
    `Date: De ${reservation.date_debut} Jusqu'au ${reservation.date_fin}`,
    marginLeft,
    currentY
  );
  currentY += lineHeight * 2; // Espace supplémentaire avant la prochaine section

  pdf.setDrawColor(0, 0, 0); // Noir pour la ligne de séparation
  currentY += 10;
  pdf.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
  currentY += lineHeight;

  // Détails spécifiques selon le type d'offre
  pdf.setTextColor(150, 150, 150); // Gris pour les titres des sections
  switch (reservation.offre.type) {
    case 'hotel':
      currentY -= 5;
      pdf.text(`Détails de l'hôtel:`, marginLeft, currentY - lineHeight); // Titre juste au-dessus de la ligne
      currentY += lineHeight; // Décalage vers le bas pour les détails
      pdf.setTextColor(0, 0, 0); // Noir pour les détails
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
      break;
    case 'voyage':
      currentY -= 5;
      pdf.text(`Détails du voyage:`, marginLeft, currentY - lineHeight); // Titre juste au-dessus de la ligne
      currentY += lineHeight; // Décalage vers le bas pour les détails
      pdf.setTextColor(0, 0, 0); // Noir pour les détails
      pdf.text(
        `Nombre de jours: ${reservation.details.nbr_jours}`,
        marginLeft,
        currentY
      );
      break;
    case 'activite':
      currentY -= 5;
      pdf.text(`Détails de l'activité:`, marginLeft, currentY - lineHeight); // Titre juste au-dessus de la ligne
      currentY += lineHeight; // Décalage vers le bas pour les détails
      pdf.setTextColor(0, 0, 0); // Noir pour les détails
      pdf.text(
        `Durée: ${reservation.details.duree} heures`,
        marginLeft,
        currentY
      );
      break;
  }

  currentY += lineHeight * 3; // Espace avant la section suivante

  pdf.setDrawColor(0, 0, 0); // Noir pour la ligne de séparation
  currentY += 10;
  pdf.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
  currentY += lineHeight;

  // Détails du collaborateur
  pdf.setTextColor(150, 150, 150); // Gris pour les titres des sections
  currentY -= 5;
  pdf.text(`Détails du collaborateur:`, marginLeft, currentY - lineHeight); // Titre juste au-dessus de la ligne
  currentY += lineHeight; // Décalage vers le bas pour les détails
  pdf.setTextColor(0, 0, 0); // Noir pour les détails
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

  currentY += lineHeight * 2; // Espace avant la section suivante

  pdf.setDrawColor(0, 0, 0); // Noir pour la ligne de séparation
  currentY += 10;
  pdf.line(marginLeft, currentY, pageWidth - marginLeft, currentY);
  currentY += lineHeight;

  // Détails de l'employé
  pdf.setTextColor(150, 150, 150); // Gris pour les titres des sections
  currentY -= 5;
  pdf.text(`Détails de l'employé:`, marginLeft, currentY - lineHeight); // Titre juste au-dessus de la ligne
  currentY += lineHeight; // Décalage vers le bas pour les détails
  pdf.setTextColor(0, 0, 0); // Noir pour les détails
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
  pdf.text(
    `Téléphone: ${
      reservation.employe && reservation.employe.utilisateur
        ? reservation.employe.utilisateur.tel
        : 'N/A'
    }`,
    marginLeft,
    (currentY += lineHeight)
  );

  currentY += lineHeight * 2; // Espace avant la section suivante

  // Pied de page
  pdf.setFontSize(12);
  pdf.setTextColor(25, 31, 67); // Couleur bleu foncé
  pdf.text(
    'Club22 Ooredoo',
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 30,
    'center'
  );
  const reservationData = {
    reservationId: reservation.id_reservation,
    guestName:
      reservation.employe.utilisateur.nom +
      ' ' +
      reservation.employe.utilisateur.prenom,
    checkInDate: reservation.date_debut,
    checkOutDate: reservation.date_fin,
    totalPrice: reservation.prix_totale,
    status: reservation.etat,
    // Ajoutez d'autres détails selon le besoin
  };
  // Generate the QR code image
  const qrData = JSON.stringify(reservationData); // Convert reservation data to a string
  const qrImage = await QRCode.toDataURL(qrData);

  // Draw the QR code image on the PDF
  const qrImageWidth = 100; // Adjust the size as needed
  const qrImageHeight = 100; // Adjust the size as needed
  const qrImageX = pageWidth - marginLeft - qrImageWidth - 20; // Adjust the position as needed
  const qrImageY = currentY + 20; // Adjust the position as needed
  pdf.addImage(qrImage, 'PNG', qrImageX, qrImageY, qrImageWidth, qrImageHeight);
  // Sauvegarde du PDF
  pdf.save('reservation.pdf');
};

 const fetchDeductionDetails = async () => {
        try {
            const response = await axios.get('http://localhost:5000/myReservationsDeduction', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDeductionDetails(response.data);
            setShowModal(true);
        } catch (err) {
            console.error('Error fetching deduction details:', err);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
        <Button
          onClick={fetchDeductionDetails}
          variant="h6"
          sx={{
            mb: 1,
            color: '#59709e',
            fontWeight: 'bold',
            textTransform: 'uppercase',
          }}
        >
          Historique déduction salaire
        </Button>
        <Modal open={showModal} onClose={handleCloseModal} closeAfterTransition>
          <Fade in={showModal}>
            {deductionDetails.length > 0 ? (
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  maxWidth: '400px',
                  margin: 'auto',
                  marginTop: '150px',
                }}
              >
                {deductionDetails.map((detail) => (
                  <Card
                    key={detail.id_reservation}
                    style={{
                      marginBottom: '20px',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" style={{ marginBottom: '10px' }}>
                        {detail.offre.titre}
                      </Typography>
                      <Typography
                        style={{ marginBottom: '5px' }}
                      >{`Date Paiement: ${new Date(
                        detail.date_paiement
                      ).toLocaleDateString()}`}</Typography>
                      <Typography>
                        {`Montant Deduit: ${detail.montant_deduit}`} DT
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '20px',
                  borderRadius: '10px',
                  maxWidth: '400px',
                  margin: 'auto',
                  marginTop: '150px',
                }}
              >
                <Typography>Aucun détail de déduction à afficher.</Typography>
              </div>
            )}
          </Fade>
        </Modal>
        <Grid container spacing={2} style={{ margin: 20 }}>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      color: '#3a547f',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Vos réservations en attente
                  </Typography>
                  <Card raised sx={{ height: 308, overflowY: 'auto' }}>
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
                                  Réservation annulée
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
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 1,
                      color: '#3a547f',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    Vos réservations confirmées
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

          <Grid item xs={12} md={5.5}>
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: '#3a547f',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                }}
              >
                État des réservations traitées
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
                        {reservation.etat === 'accepter' &&
                          new Date(currentDate.toISOString().split('T')[0]) >
                            new Date(reservation.date_debut) && (
                            <> {renderStars(reservation)}</>
                          )}
                        {reservation.etat === 'accepter' && (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                              color="#3275c4"
                              fill="none"
                              onClick={(event) => {
                                event.stopPropagation();
                                downloadReservationPDF(reservation);
                              }}
                            >
                              <path
                                d="M12.5 2H12.7727C16.0339 2 17.6645 2 18.7969 2.79784C19.1214 3.02643 19.4094 3.29752 19.6523 3.60289C20.5 4.66867 20.5 6.20336 20.5 9.27273V11.8182C20.5 14.7814 20.5 16.2629 20.0311 17.4462C19.2772 19.3486 17.6829 20.8491 15.6616 21.5586C14.4044 22 12.8302 22 9.68182 22C7.88275 22 6.98322 22 6.26478 21.7478C5.10979 21.3424 4.19875 20.4849 3.76796 19.3979C3.5 18.7217 3.5 17.8751 3.5 16.1818V12"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M20.5 12C20.5 13.8409 19.0076 15.3333 17.1667 15.3333C16.5009 15.3333 15.716 15.2167 15.0686 15.3901C14.4935 15.5442 14.0442 15.9935 13.8901 16.5686C13.7167 17.216 13.8333 18.0009 13.8333 18.6667C13.8333 20.5076 12.3409 22 10.5 22"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M4.5 7.5C4.99153 8.0057 6.29977 10 7 10M9.5 7.5C9.00847 8.0057 7.70023 10 7 10M7 10L7 2"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>{' '}
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
                onReservationUpdated={handleReservationUpdated}
              />
            </>
          )}
        </Grid>
      </>
    );
};

export default MyReservations;