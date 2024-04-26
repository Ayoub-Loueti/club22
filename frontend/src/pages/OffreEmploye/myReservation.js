import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Grid, Card, CardContent, Typography, Button, Box } from '@mui/material';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';
import ShowReservationDialog from './ShowReservationDialog'; // Import the dialog component
import ModifyReservation from './ModifyReservation'; // Import the ModifyReservation component

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [boxDReservations, setBoxDReservations] = useState([]);
    const [boxTReservations, setBoxTReservations] = useState([]);
    const [error, setError] = useState('');
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
    const [ratings, setRatings] = useState({});

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
                title: 'Are you sure?',
                text: "Do you want to confirm this reservation?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, confirm it!',
                cancelButtonText: 'No, cancel!',
                reverseButtons: true
            });
            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/reservation/${id}/confirmer`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire('Confirmed!', 'The reservation has been confirmed.', 'success');
                setReservations(reservations.map(r => r.id_reservation === id ? { ...r, etat: 'confirmed' } : r));
            }
        } catch (err) {
            Swal.fire('Failed!', 'There was an error confirming the reservation.', 'error');
        }
    };

    const cancelReservation = async (event, id) => {
        event.stopPropagation();
        const token = JSON.parse(localStorage.getItem('login'))?.token;
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to cancel this reservation?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, cancel it!',
                cancelButtonText: 'No, keep it',
                reverseButtons: true
            });
            if (result.isConfirmed) {
                await axios.put(`http://localhost:5000/reservation/${id}/annuler`, {}, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                Swal.fire('Cancelled!', 'The reservation has been cancelled.', 'success');
                setReservations(reservations.map(r => r.id_reservation === id ? { ...r, etat: 'cancelled' } : r));
            }
        } catch (err) {
            Swal.fire('Failed!', 'There was an error cancelling the reservation.', 'error');
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
            Swal.fire('Failed!', 'Failed to submit vote.', 'error');
        }
    };

    return (
        <>
            <Navbar />
            <NavbarHaut />
            {error && <Typography color="error" sx={{ m: 2 }}>{error}</Typography>}
            <Grid container spacing={2} style={{ margin: 20 }}>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h5" sx={{ mb: 1 }}>
                                Premiere phase
                            </Typography>
                            <Card raised sx={{ height: 290, overflowY: 'auto' }}>
                                <CardContent>
                                    {reservations.map((reservation) => (
                                        <Card key={reservation.id_reservation} variant="outlined" sx={{ mb: 2, display: 'flex', backgroundColor: '#F4F4F4', cursor: 'pointer' }} onClick={() => handleOpenDialog(reservation)}>
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
                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, padding: 2 }}>
                                                <Box>
                                                    <Typography variant="h6">{reservation.offre.titre}</Typography>
                                                    <Typography variant="body2">{reservation.offre.collaborateur.nom}</Typography>
                                                    <Typography variant="body1" color="primary">{reservation.prix_totale} TND</Typography>
                                                    {reservation.etat === 'annuler' && (
                                                        <Typography style={{ color: 'red', fontWeight: 'bold' }}>
                                                            Reservation annulée
                                                        </Typography>
                                                    )}
                                                </Box>
                                                {reservation.etat === 'en_cours' && (
                                                    <Box display="flex" justifyContent="flex-end">
                                                        <Button size="small" variant="contained"
                                                            sx={{ backgroundColor: '#5CA163', '&:hover': { backgroundColor: '#4B8A50' }, mr: 1 }}
                                                            onClick={(event) => confirmReservation(event, reservation.id_reservation)}>
                                                            Confirmer
                                                        </Button>
                                                        <Button size="small" variant="contained" 
                                                            sx={{ backgroundColor: '#E3D97F', '&:hover': { backgroundColor: '#D0C170' }, mr: 1 }}
                                                            onClick={(event) => { event.stopPropagation(); handleModifyDialogOpen(reservation); }}>
                                                            Modify
                                                        </Button>
                                                        <Button size="small" variant="contained"
                                                            sx={{ backgroundColor: '#C50F10', '&:hover': { backgroundColor: '#B00C0E' } }}
                                                            onClick={(event) => cancelReservation(event, reservation.id_reservation)}>
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
                                Deuxieme Phase
                            </Typography>
                            <Card raised sx={{ height: 290, overflowY: 'auto' }}>
                                <CardContent>
                                    {boxDReservations.map((reservation) => (
                                        <Card key={reservation.id_reservation} variant="outlined" sx={{ mb: 2, display: 'flex', backgroundColor: getCardBackgroundColor(reservation.etat), cursor: 'pointer' }} onClick={() => handleOpenDialog(reservation)}>
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
                                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, padding: 2 }}>
                                                <Box>
                                                    <Typography variant="h6">{reservation.offre.titre}</Typography>
                                                    <Typography variant="body2">{reservation.offre.collaborateur.nom}</Typography>
                                                    <Typography variant="body1" color="primary">{reservation.prix_totale} TND</Typography>
                                                    {reservation.etat === 'reparation' && (
                                                        <Typography style={{ color: 'red', fontWeight: 'bold' }}>
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
                        Resultat
                    </Typography>
                    <Card raised sx={{ height: 670, overflowY: 'auto' }}>
                        <CardContent>
                            {boxTReservations.map((reservation) => (
                                <Card key={reservation.id_reservation} variant="outlined" sx={{ mb: 2, display: 'flex', backgroundColor: getCardBackgroundColor(reservation.etat), cursor: 'pointer' }} onClick={() => handleOpenDialog(reservation)}>
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
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1, padding: 2 }}>
                                        <Box>
                                            <Typography variant="h6">{reservation.offre.titre}</Typography>
                                            <Typography variant="body2">{reservation.offre.collaborateur.nom}</Typography>
                                            <Typography variant="body1" color="primary">{reservation.prix_totale} TND</Typography>
                                            {reservation.etat === 'accepter' && (
                                                <>
                                                    <Typography style={{ color: 'black', fontWeight: 'bold' }}>
                                                        Réservation acceptée avec succès
                                                    </Typography>
                                                    {renderStars(reservation)}
                                                </>
                                            )}
                                            {reservation.etat === 'refuser' && (
                                                <Typography style={{ color: 'black', fontWeight: 'bold' }}>
                                                    Réservation a été refusé
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
