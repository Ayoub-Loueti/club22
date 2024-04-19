import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Card, CardContent, Typography, Avatar, Button, Box } from '@mui/material';
import Navbar from '../../components/navbar/navbar';
import NavbarHaut from '../../components/navbar/navbarHaut';

const MyReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch reservations from the backend
        const fetchReservations = async () => {
            const token = JSON.parse(localStorage.getItem('login'))?.token;

            try {
                const response = await axios.get('http://localhost:5000/myReservations', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setReservations(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('You are not authorized to view this data.');
                } else {
                    setError('An error occurred while fetching reservations.');
                }
                console.error('Error fetching reservations:', err);
            }
        };

        fetchReservations();
    }, []);

    return (
        <>
            <Navbar />
            <NavbarHaut />
            {error && <Typography color="error" sx={{ m: 2 }}>{error}</Typography>}
            <Grid container spacing={2} style={{ margin: 20 }}>
                <Grid item xs={12} md={6}>
                    <Card raised sx={{ height: 550, overflowY: 'auto' }}>
                        <CardContent>
                            {reservations.map((reservation) => (
                                <Card key={reservation.id_reservation} variant="outlined" sx={{ mb: 2, p: 2, backgroundColor: '#F4F4F4' }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item>
                                            <Avatar alt="Hotel" src={`http://localhost:5000/${reservation.offre.collaborateur.logo}`} />
                                        </Grid>
                                        <Grid item xs>
                                            <Typography variant="h6">{reservation.offre.titre}</Typography>
                                            <Typography variant="body2">{reservation.offre.collaborateur.nom}</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="body1" color="primary">{reservation.prix_totale} TND</Typography>
                                        </Grid>
                                    </Grid>
                                    <Box display="flex" justifyContent="flex-end" mt={1}>
                                        <Button size="small" variant="contained" sx={{ backgroundColor: '#5CA163', '&:hover': { backgroundColor: '#4B8A50' }, mr: 1 }}>Confirmer</Button>
                                        <Button size="small" variant="contained" sx={{ backgroundColor: '#E3D97F', '&:hover': { backgroundColor: '#D0C170' }, mr: 1 }}>Modifier</Button>
                                        <Button size="small" variant="contained" sx={{ backgroundColor: '#C50F10', '&:hover': { backgroundColor: '#B00C0E' } }}>Annuler</Button>
                                    </Box>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <Card raised sx={{ height: 250 }}>
                                <CardContent>Box 2 (Top Right)</CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            <Card raised sx={{ height: 250 }}>
                                <CardContent>Box 3 (Bottom Right)</CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default MyReservations;
