import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Card, CardContent, Typography, Button, Box, ToggleButton, ToggleButtonGroup,IconButton  } from '@mui/material';import ShowReservationDialog from "../../OffreEmploye/ShowReservationDialog";
import NavAdmin from '../NavAdmin/navAdmin';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const MyReservations = ({ collaborateurId }) => {
    const [demandeReservations, setDemandeReservations] = useState([]); 
    const [reponseReservations, setReponseReservations] = useState([]); 
    const [error, setError] = useState('');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [demandeFilter, setDemandeFilter] = useState('tous');
    const [reponseFilter, setReponseFilter] = useState('tous');
    const [filteredDemandeReservations, setFilteredDemandeReservations] = useState([]); 
    const [filteredReponseReservations, setFilteredReponseReservations] = useState([]);

    useEffect(() => {
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        
        const fetchDemandeReservations = async () => {
            try {
                console.log('Fetching demander reservations for collaborator ID:', collaborateurId);
                const response = await axios.get(`http://localhost:5000/getReservByCollabA/${collaborateurId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log('Demande Reservations:', response.data);
                setDemandeReservations(response.data); // Setting the demander reservations
                setFilteredDemandeReservations(response.data); // Setting the filtered demander reservations initially
            } catch (err) {
                console.error('Error fetching demander reservations:', err);
            }
        };
        
        const fetchReponseReservations = async () => {
            try {
                console.log('Fetching reponse reservations for collaborator ID:', collaborateurId);
                const response = await axios.get(`http://localhost:5000/getReservByCollabB/${collaborateurId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
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
                return '#70CD32'; // Lime green, a bright and positive color for 'accepter' state
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
          const filtered = demandeReservations.filter(reservation => reservation.etat === demandeFilter);
          setFilteredDemandeReservations(filtered);
      }
  }, [demandeFilter, demandeReservations]);

  useEffect(() => {
      if (reponseFilter === 'tous') {
          setFilteredReponseReservations(reponseReservations);
      } else {
          const filtered = reponseReservations.filter(reservation => reservation.etat === reponseFilter);
          setFilteredReponseReservations(filtered);
      }
  }, [reponseFilter, reponseReservations]);
  
  const handleAccept = async (id, event) => {
    event.stopPropagation();  // Prevent opening the dialog
    const token = JSON.parse(localStorage.getItem('login'))?.token;
    try {
        const response = await axios.put(`http://localhost:5000/reservation/${id}/accepter`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
            Swal.fire('Accepted!', 'The reservation has been accepted.', 'success');
            // Reload or update local state here
        }
    } catch (error) {
        console.error('Error accepting reservation:', error);
        Swal.fire('Error!', 'Failed to accept the reservation.', 'error');
    }
};

const handleRefuse = async (id, event) => {
    event.stopPropagation();  // Prevent opening the dialog
    const token = JSON.parse(localStorage.getItem('login'))?.token;
    try {
        const response = await axios.put(`http://localhost:5000/reservation/${id}/refuser`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
            Swal.fire('Refused!', 'The reservation has been refused.', 'success');
            // Reload or update local state here
        }
    } catch (error) {
        console.error('Error refusing reservation:', error);
        Swal.fire('Error!', 'Failed to refuse the reservation.', 'error');
    }
};
const downloadPDF = async (reservationId) => {
  // Ensure the element ID is correctly formed and points to an existing element
  const elementId = `reservation-card-${reservationId}`;
  const input = document.getElementById(elementId);
  if (input) {
    try {
      const canvas = await html2canvas(input, {
        scale: window.devicePixelRatio,
        useCORS: true,
        logging: true, // Enable for debugging
        windowHeight: input.scrollHeight,
        windowWidth: input.scrollWidth,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`reservation_${reservationId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  } else {
    console.error('No input element found with ID:', elementId);
  }
};
const handleDownloadClick = (e, reservationId) => {
  e.stopPropagation(); // This will prevent the event from bubbling up to the parent
  downloadPDF(reservationId);
};


    return (
      <>
        <NavAdmin />
        {error && (
          <Typography color="error" sx={{ m: 2 }}>
            {error}
          </Typography>
        )}
        <Grid container spacing={2} style={{ margin: 20 }}>
          {/* Grid for demander Reservations */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <ToggleButtonGroup
                value={demandeFilter}
                exclusive
                onChange={(event, value) => setDemandeFilter(value)}
                aria-label="Demande Filter"
                sx={{ margin: '0 auto', mb: 2 }}
              >
                <ToggleButton value="tous">Tous</ToggleButton>
                <ToggleButton value="confirmer">Confirmer</ToggleButton>
                <ToggleButton value="reparation">Réparation</ToggleButton>
              </ToggleButtonGroup>
              <Card raised sx={{ height: 600, overflowY: 'auto' }}>
                <CardContent>
                  {filteredDemandeReservations.map((reservation) => (
                    <Card
                      key={reservation.id_reservation}
                      id={`reservation-card-${reservation.id_reservation}`}
                      variant="outlined"
                      sx={{
                        height: 150,
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
                            <IconButton size="small" aria-label="download">
                              <DownloadForOfflineIcon />
                            </IconButton>
                            <button
                              onClick={(e) =>
                                handleDownloadClick(
                                  e,
                                  reservation.id_reservation
                                )
                              }
                            >
                              Télécharger PDF
                            </button>
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

          {/* Grid for reponse Reservations */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <ToggleButtonGroup
                value={reponseFilter}
                exclusive
                onChange={(event, value) => setReponseFilter(value)}
                aria-label="Réponse Filter"
                sx={{ margin: '0 auto', mb: 2 }}
              >
                <ToggleButton value="tous">Tous</ToggleButton>
                <ToggleButton value="accepter">Accepter</ToggleButton>
                <ToggleButton value="refuser">Refuser</ToggleButton>
              </ToggleButtonGroup>
              <Card raised sx={{ height: 600, overflowY: 'auto' }}>
                <CardContent>
                  {filteredReponseReservations.map((reservation) => (
                    <Card
                      key={reservation.id_reservation}
                      variant="outlined"
                      sx={{
                        height: 150,
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
                          {reservation.etat === 'accepter' && (
                            <Typography
                              style={{ color: 'black', fontWeight: 'bold' }}
                            >
                              Réservation acceptée avec succès
                            </Typography>
                          )}
                          {reservation.etat === 'refuser' && (
                            <Typography
                              style={{ color: 'black', fontWeight: 'bold' }}
                            >
                              Réservation a été refusée
                            </Typography>
                          )}
                        </Box>
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
                          src={`http://localhost:5000/${reservation.offre.images && reservation.offre.images[0]}`}
                          alt="Offre"
                      />
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </Box>
          </Grid>

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
        </Grid>
      </>
    );
};

export default MyReservations;
