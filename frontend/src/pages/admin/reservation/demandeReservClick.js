import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
} from '@mui/material';
import ShowReservationDialog from '../../OffreEmploye/ShowReservationDialog';
import NavAdmin from '../NavAdmin/navAdmin';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import ooredooLogo from './../../../assets/ooredoo2.png';

const DemandeReserClick = ({ collaborateurId }) => {
  const [demandeReservations, setDemandeReservations] = useState([]);
  const [reponseReservations, setReponseReservations] = useState([]);
  const [error, setError] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [demandeFilter, setDemandeFilter] = useState('tous');
  const [reponseFilter, setReponseFilter] = useState('tous');
  const [filteredDemandeReservations, setFilteredDemandeReservations] =
    useState([]);
     const [updatedReservations, setUpdatedReservations] =
       useState(demandeReservations);
  const [filteredReponseReservations, setFilteredReponseReservations] =
    useState([]);

    const token = JSON.parse(localStorage.getItem('login'))?.token;

     const fetchDemandeReservations = async () => {
       try {
         console.log(
           'Fetching demander reservations for collaborator ID:',
           collaborateurId
         );
         const response = await axios.get(
           `http://localhost:5000/getReservByCollabA/${collaborateurId}`,
           {
             headers: { Authorization: `Bearer ${token}` },
           }
         );
         console.log('Demande Reservations:', response.data);
         setDemandeReservations(response.data); // Setting the demander reservations
         setFilteredDemandeReservations(response.data); // Setting the filtered demander reservations initially
       } catch (err) {
         console.error('Error fetching demander reservations:', err);
       }
     };
const handlerepair = async (id, event) => {
  event.stopPropagation(); // Prevent opening the dialog
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  try {
    const response = await axios.put(
      `http://localhost:5000/reservation/${id}/reparer`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status === 200) {
      Swal.fire({
        title: 'Validation réussie !',
        text: 'La réservation a été validée avec succès.',
        icon: 'success',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      fetchDemandeReservations(); // Reload or update local state here
    }
  } catch (error) {
    console.error('Erreur lors de la réparation de la réservation :', error);
    Swal.fire('Erreur !', 'Échec de la réparation de la réservation.', 'error');
  }
};


const markAllAsReparation = async (date) => {
  const token = JSON.parse(localStorage.getItem('login'))?.token;
  const reservationIds = groupedReservations[date].map(
    (reservation) => reservation.id_reservation
  );
  try {
    const response = await axios.put(
      'http://localhost:5000/reservations/reparer',
      { reservationIds },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.status === 200) {
      Swal.fire({
        title: 'Validation de toutes les réservations réussie !',
        text: 'Toutes les réservations sélectionnées ont été validées.',
        icon: 'success',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      }); // Reload or update local state here
      fetchDemandeReservations();
    }
  } catch (error) {
    console.error('Erreur lors de la réparation des réservations :', error);
    Swal.fire('Erreur !', 'Échec de la réparation des réservations.', 'error');
  }
};
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('login'))?.token;

    const fetchDemandeReservations = async () => {
      try {
        console.log(
          'Fetching demander reservations for collaborator ID:',
          collaborateurId
        );
        const response = await axios.get(
          `http://localhost:5000/getReservByCollabA/${collaborateurId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Demande Reservations:', response.data);
        setDemandeReservations(response.data); // Setting the demander reservations
        setFilteredDemandeReservations(response.data); // Setting the filtered demander reservations initially
      } catch (err) {
        console.error('Error fetching demander reservations:', err);
      }
    };
  
    const fetchReponseReservations = async () => {
      try {
        console.log(
          'Fetching reponse reservations for collaborator ID:',
          collaborateurId
        );
        const response = await axios.get(
          `http://localhost:5000/getReservByCollabB/${collaborateurId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log('Reponse Reservations:', response.data);
        setReponseReservations(response.data); // Setting the reponse reservations
        setFilteredReponseReservations(response.data); // Setting the filtered reponse reservations initially
      } catch (err) {
        console.error('Error fetching reponse reservations:', err);
      }
    };

    if (collaborateurId) {
      fetchDemandeReservations();
      fetchReponseReservations();
    }
  }, [collaborateurId]);

  const handleOpenDialog = (reservation) => {
    setSelectedReservation(reservation);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const getCardBackgroundColor = (etat) => {
    switch (etat) {
      case 'reparation':
        return '#ADD8E6'; // Light blue color for 'reparation' state
      case 'refuser':
        return '#FF6347'; // Tomato red, a beautiful shade for 'refuser' state
      case 'accepter':
        return '#e9fced'; // Lime green, a bright and positive color for 'accepter' state
      case 'en_cours':
        return '#F4F4F4'; // Default light grey color for 'in progress' state
      default:
        return '#F4F4F4'; // Default color for other states
    }
  };

  useEffect(() => {
    if (demandeFilter === 'tous') {
      setFilteredDemandeReservations(demandeReservations);
    } else {
      const filtered = demandeReservations.filter(
        (reservation) => reservation.etat === demandeFilter
      );
      setFilteredDemandeReservations(filtered);
    }
  }, [demandeFilter, demandeReservations]);

  useEffect(() => {
    if (reponseFilter === 'tous') {
      setFilteredReponseReservations(reponseReservations);
    } else {
      const filtered = reponseReservations.filter(
        (reservation) => reservation.etat === reponseFilter
      );
      setFilteredReponseReservations(filtered);
    }
  }, [reponseFilter, reponseReservations]);

  const handleAccept = async (id, event) => {
    event.stopPropagation(); // Prevent opening the dialog
    const token = JSON.parse(localStorage.getItem('login'))?.token;
    try {
      const response = await axios.put(
        `http://localhost:5000/reservation/${id}/accepter`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: 'Acceptation réussie !',
          text: 'La réservation a été acceptée avec succès.',
          icon: 'success',
          timer: 2500, // L'alerte disparaîtra après 2500 millisecondes (3 secondes)
          timerProgressBar: true, // Affiche une barre de progression qui indique le temps restant
          showConfirmButton: false, // N'affiche pas le bouton de confirmation
        });
        setDemandeReservations((prevReservations) =>
          prevReservations.filter(
            (reservation) => reservation.id_reservation !== id
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la réservation :", error);
      Swal.fire(
        'Erreur !',
        "Échec de l'acceptation de la réservation.",
        'error'
      );
    }
  };

  const handleRefuse = async (id, event) => {
    event.stopPropagation(); // Prevent opening the dialog
    const token = JSON.parse(localStorage.getItem('login'))?.token;
    try {
      const response = await axios.put(
        `http://localhost:5000/reservation/${id}/refuser`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        Swal.fire({
          title: 'Refus réussi !',
          text: 'La réservation a été refusée.',
          icon: 'info',
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
        });
        setDemandeReservations((prevReservations) =>
          prevReservations.filter(
            (reservation) => reservation.id_reservation !== id
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du refus de la réservation :', error);
      Swal.fire('Erreur !', 'Échec du refus de la réservation.', 'error');
    }
  };
  
  const downloadPDF = async (reservationId) => {
    const reservation = demandeReservations.find(
      (res) => res.id_reservation === reservationId
    );
    if (!reservation) {
      console.error('Réservation non trouvée:', reservationId);
      return;
    }

    const pdf = new jsPDF();

    // Ajouter le logo et le texte d'en-tête
    pdf.addImage(ooredooLogo, 'PNG', 10, 5, 25, 25);
    pdf.setFontSize(14);
    pdf.setTextColor('#333333');
    pdf.text(
      `Détails de la réservation pour ${
        reservation.date_reservation.split('T')[0]
      }`,
      70,
      30
    );

    // Dessiner un rectangle comme carte pour la réservation
    pdf.setFillColor('#f2f2f2'); // Couleur de fond gris clair pour la carte
    const cardHeight = calculateCardHeight(reservation); // Calculer la hauteur de la carte en fonction du contenu
    pdf.rect(10, 40, 180, cardHeight, 'F'); // Dessiner un rectangle rempli comme carte
    pdf.setTextColor('#000000'); // Définir la couleur du texte en noir pour une meilleure lisibilité

    // Ajouter le logo du collaborateur et le nom en haut au centre
    const logoData = getCollaborateurLogoUrl(reservation);
    pdf.addImage(logoData, 'JPEG', 70, 45, 30, 30); // Ajuster le positionnement au besoin
    pdf.text(
      `Nom Collaborateur: ${reservation.offre.collaborateur.nom}`,
      105,
      60
    );

    // Ajouter les détails de la réservation à la carte
    pdf.text(
      `Date : De ${reservation.date_debut} Jusq'ua ${reservation.date_fin}`,
      30,
      80
    );
    pdf.text(`Titre: ${reservation.offre.titre}`, 30, 100);
    pdf.text(`Destination: ${reservation.offre.destination}`, 30, 110);
    pdf.text(`Type: ${reservation.typeR}`, 30, 120);
    pdf.text(
      `Nom de l'employé: ${reservation.employe.utilisateur.nom} ${reservation.employe.utilisateur.prenom}`,
      30,
      130
    );
    pdf.text(
      `Email de l'employé: ${reservation.employe.utilisateur.email}`,
      30,
      140
    );
    pdf.text(
      `Tél de l'employé: ${reservation.employe.utilisateur.tel}`,
      30,
      150
    );
    pdf.text(`Prix: ${reservation.prix_totale.toFixed(2)} DT`, 30, 160);

    // Ajouter des détails spécifiques en fonction du type de réservation
    let yPos = 170;
    switch (reservation.typeR) {
      case 'hotel':
        pdf.text(`Nom de l'hotel: ${reservation.details.nom_hotel}`, 30, yPos);
        yPos += 20; // Augmenter la position Y pour une séparation visuelle entre le nom de l'hôtel et les détails des chambres
        pdf.text('Chambres:', 30, yPos);
        reservation.rooms.forEach((room, roomIndex) => {
          const roomDetails = `Chambre ${roomIndex + 1}: Adultes - ${
            room.nbr_adults
          }, Enfants - ${room.nbr_enfants}, Prix - ${room.prix.toFixed(2)} DT`;
          pdf.text(roomDetails, 35, yPos + 10 + roomIndex * 10);
        });
        break;
      case 'autre':
        pdf.text(`Nombre de personnes: ${reservation.nombre}`, 30, yPos);
        break;
      case 'voyage':
        pdf.text(`Nombre de jours: ${reservation.details.nbr_jours}`, 30, yPos);
        pdf.text(`Nombre de personnes: ${reservation.nombre}`, 30, yPos + 10);
        pdf.text(`Inclus: ${reservation.details.inclus}`, 30, yPos + 20);
        break;
      case 'activite':
        pdf.text(`Durée: ${reservation.details.duree} heures`, 30, yPos);
        pdf.text(`Inclus: ${reservation.details.inclus}`, 30, yPos + 10);
        break;
      default:
        break;
    }

    // Ajouter l'image à la carte
    const imgData = reservation.offre.images[0]; // Supposons qu'il y a au moins une image
    pdf.addImage(imgData, 'JPEG', 130, 45, 60, 60);

    // Enregistrer et télécharger le PDF
    pdf.save(`reservation_${reservationId}.pdf`);
  };
  const handleDownloadClick = (e, reservationId) => {
    e.stopPropagation(); // This will prevent the event from bubbling up to the parent
    downloadPDF(reservationId);
  };
const groupReservationsByDate = (reservations) => {
  const groupedReservations = {};
  reservations.forEach((reservation) => {
    const date = reservation.date_reservation.split('T')[0]; // Extract date without time
    if (groupedReservations[date]) {
      groupedReservations[date].push(reservation);
    } else {
      groupedReservations[date] = [reservation];
    }
  });

  // Sort grouped reservations by date in descending order
  const sortedGroupedReservations = Object.entries(groupedReservations)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .reduce((acc, [date, reservations]) => {
      acc[date] = reservations;
      return acc;
    }, {});

  return sortedGroupedReservations;
};

const groupedReservations = groupReservationsByDate(
  filteredDemandeReservations
);
const downloadPDFConfirmedByDate = async (date) => {
  const pdf = new jsPDF();

  // Add Ooredoo logo and header text
  pdf.addImage(ooredooLogo, 'PNG', 10, 5, 25, 25);
  pdf.setFontSize(14);
  pdf.setTextColor('#333333');
  pdf.text(`Le(s) réservation(s) Confirmée(s) pour le ${date}`, 70, 30);

  // Add confirmed reservations for the date to the PDF
  groupedReservations[date].forEach((reservation, index) => {
    if (reservation.etat === 'confirmer') {
      // Add a new page for each reservation except the first one
      if (index > 0) {
        pdf.addPage();
      }

      // Draw a rectangle as a card for the reservation
      pdf.setFillColor('#f2f2f2'); // Light gray background color for the card
      const cardHeight = calculateCardHeight(reservation); // Calculate card height based on content
      pdf.rect(10, 40, 180, cardHeight, 'F'); // Draw a filled rectangle as a card
      pdf.setTextColor('#000000'); // Set text color to black for better readability

      // Add collaborator's logo and name at the top center
      const logoData = getCollaborateurLogoUrl(reservation);
      pdf.addImage(logoData, 'JPEG', 70, 45, 30, 30); // Adjust the positioning as needed
      pdf.text(
        `Nom Collaborateur: ${reservation.offre.collaborateur.nom}`,
        105,
        60
      );

      // Add reservation details to the card
      pdf.text(
        `Date : De ${reservation.date_debut} Jusq'ua ${reservation.date_fin}`,
        30,
        80
      ); // Add dates

      pdf.text(`Titre: ${reservation.offre.titre}`, 30, 100);
      pdf.text(`Destination: ${reservation.offre.destination}`, 30, 110);
      pdf.text(`Type: ${reservation.typeR}`, 30, 120);
      pdf.text(
        `Nom de l'employé: ${reservation.employe.utilisateur.nom} ${reservation.employe.utilisateur.prenom}`,
        30,
        130
      );
      pdf.text(
        `Email de l'employé: ${reservation.employe.utilisateur.email}`,
        30,
        140
      );
      pdf.text(
        `  tél de l'employé: ${reservation.employe.utilisateur.tel}`,
        30,
        150
      );
      pdf.text(`Prix: ${reservation.prix_totale.toFixed(2)} DT`, 30, 160);

      // Add specific details based on reservation type
      let yPos = 170;
      switch (reservation.typeR) {
        case 'hotel':
          pdf.text(
            `Nom de l'hotel: ${reservation.details.nom_hotel}`,
            30,
            yPos
          );
          yPos += 20; // Increase Y position for visual separation between hotel name and room details

          pdf.text('Chambres:', 30, yPos);
          reservation.rooms.forEach(
            (room, roomIndex) => {
              const roomDetails = `Chambre ${roomIndex + 1}: Adultes - ${
                room.nbr_adults
              }, Enfants - ${room.nbr_enfants}, Prix - ${room.prix.toFixed(
                2
              )} DT`;
              pdf.text(roomDetails, 35, yPos + 10 + roomIndex * 10);
            },
            30,
            yPos
          );

          break;
        case 'autre':
          pdf.text(`Nombre de personnes: ${reservation.nombre}`, 30, yPos);
          break;
        case 'voyage':
          pdf.text(
            `Nombre de jours: ${reservation.details.nbr_jours}`,
            30,
            yPos
          );
          pdf.text(`Nombre de personnes: ${reservation.nombre}`, 30, yPos + 10); // Add number of persons for voyages
          pdf.text(`Inclus: ${reservation.details.inclus}`, 30, yPos + 20);
          // Add other specific details for voyage
          break;
        case 'activite':
          pdf.text(`Durée: ${reservation.details.duree} heures`, 30, yPos);
          pdf.text(`Inclus: ${reservation.details.inclus}`, 30, yPos + 10);
          // Add other specific details for activite
          break;
        default:
          break;
      }

      // Add image to the card
      const imgData = reservation.offre.images[0]; // Assuming there is at least one image
      pdf.addImage(imgData, 'JPEG', 130, 45, 60, 60);

      // Move down for the next card
      yPos += 30;
    }
  });

  // Save and download the PDF
  pdf.save(`reservations_confirmees_${date}.pdf`);
};
const getCollaborateurLogoUrl = (reservation) => {
  // Vérifiez si l'URL du logo est disponible dans les données de la réservation
  if (reservation.offre.collaborateur.logo) {
    // Retournez l'URL complète du logo du collaborateur
    return `http://localhost:5000/${reservation.offre.collaborateur.logo}`;
  } else {
    // Si l'URL du logo n'est pas disponible, retournez une URL par défaut ou une image générique
    return 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffr%2Ficone-gratuite%2Fpas-dappareil-photo_482432&psig=AOvVaw2oESc9luFlfvNxWovo3iww&ust=1714921741095000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPis3Lqj9IUDFQAAAAAdAAAAABAE'; // Remplacez par votre URL par défaut
  }
};
// Function to calculate card height based on content
const calculateCardHeight = (reservation) => {
  let height = 160; // Initial height for common details
  switch (reservation.typeR) {
    case 'hotel':
      height += 20 + reservation.rooms.length * 10; // Add room details height
      break;
    case 'voyage':
      height += 30; // Add additional details for voyage
      break;
    case 'activite':
      height += 20; // Add additional details for activite
      break;
    default:
      break;
  }
  return height;
};
  return (
    <>
      <NavAdmin />
      {error && (
        <Typography color="error" sx={{ m: 2 }}>
          {error}
        </Typography>
      )}
      <Grid container spacing={2} style={{ margin: 45 }}>
        {' '}
        <ToggleButtonGroup
          value={demandeFilter}
          exclusive
          onChange={(event, value) => setDemandeFilter(value)}
          aria-label="Demande Filter"
          sx={{ margin: '0 auto', mb: 2 }} // Adjust styling as needed
        >
          <ToggleButton value="tous">Tous</ToggleButton>
          <ToggleButton value="confirmer">Confirmés</ToggleButton>
          <ToggleButton value="reparation">Validés</ToggleButton>
        </ToggleButtonGroup>
      </Grid>

      <Grid container spacing={2} >
        {Object.keys(groupedReservations).map((date) => (
          <Grid item xs={12} md={6} key={date}>
            <Typography variant="h6" sx={{ margin: '10px 0' }}>
              <Typography
                variant="h6"
                sx={{
                  margin: '10px 0',
                  color: '#fff',
                  backgroundColor: '#879eb9',
                  padding: '5px 10px',
                  borderRadius: '5px',
                }}
              >
                {date}
                <Button
    size="small"
    variant="contained"
    sx={{ backgroundColor: '#7FB2B6', color: '#fff', ml: 1 }}
    onClick={() => markAllAsReparation(date)}
  >
    Valider tous
  </Button>
                <Button
                  size="small"
                  variant="contained"
                  sx={{ backgroundColor: '#e1ae4a', color: '#fff', ml: 1 }}
                  onClick={() => downloadPDFConfirmedByDate(date)}
                >
                  Télécharger
                </Button>
              </Typography>{' '}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Card raised sx={{ height: 600, overflowY: 'auto' }}>
                <CardContent>
                  {groupedReservations[date].map((reservation) => (
                    <Card
                      key={reservation.id_reservation}
                      id={`reservation-card-${reservation.id_reservation}`}
                      variant="outlined"
                      sx={{
                        height: 170,
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
                        sx={{ position: 'relative', width: 100, height: 100 }}
                      >
                        <img
                          src={
                            reservation.employe.utilisateur.photo
                              ? `http://localhost:5000/${reservation.employe.utilisateur.photo}`
                              : 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg' // URL de votre image par défaut
                          }
                          alt="Profil"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '50%',
                            marginLeft: '10px',
                            marginTop: '10px',
                          }}
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            position: 'absolute',
                            bottom: -30,
                            width: '100%',
                            textAlign: 'center',
                            color: 'black',
                            fontSize: '0.8rem',
                          }}
                        >
                          {`${reservation.employe.utilisateur.nom} ${reservation.employe.utilisateur.prenom}`}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            position: 'absolute',
                            bottom: -45,
                            width: '100%',
                            textAlign: 'center',
                            color: 'black',
                            fontSize: '0.8rem',
                          }}
                        >
                          {reservation.employe.adherant
                            ? 'Adhérent'
                            : 'Non Adhérent'}
                        </Typography>
                      </Box>
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
                        </Box>
                        {reservation.etat === 'reparation' && (
                          <Box display="flex" justifyContent="flex-end">
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: '#5CA163',
                                '&:hover': { backgroundColor: '#4B8A50' },
                                mr: 1,
                              }}
                              onClick={(e) =>
                                handleAccept(reservation.id_reservation, e)
                              }
                            >
                              Accepter
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: '#C50F10',
                                '&:hover': { backgroundColor: '#D0C170' },
                                mr: 1,
                              }}
                              onClick={(e) =>
                                handleRefuse(reservation.id_reservation, e)
                              }
                            >
                              Refuser
                            </Button>
                          </Box>
                        )}
                        {reservation.etat === 'confirmer' && (
                          <Box display="flex" justifyContent="flex-end">
                            <IconButton
                              size="small"
                              aria-label="download"
                              onClick={(e) =>
                                handleDownloadClick(
                                  e,
                                  reservation.id_reservation
                                )
                              }
                            >
                              <DownloadForOfflineIcon />
                            </IconButton>
                            <Button
                              size="small"
                              variant="contained"
                              sx={{
                                backgroundColor: '#ABDEE6',
                                color: '#fff',
                                ml: 1,
                                '&:hover': {
                                  backgroundColor: '#7FB2B6',
                                },
                              }}
                              onClick={(event) =>
                                handlerepair(reservation.id_reservation, event)
                              }
                            >
                              Valider
                            </Button>
                          </Box>
                        )}
                      </Box>
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
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Grid for reponse Reservations */}

      {/* Dialog for showing reservation details */}
      {selectedReservation && (
        <>
          <ShowReservationDialog
            reservation={selectedReservation}
            open={showDialog}
            onClose={handleCloseDialog}
          />
        </>
      )}
    </>
  );
};

export default DemandeReserClick;
