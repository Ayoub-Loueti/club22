import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

const CeptDash = () => {
    const [totalLikes, setTotalLikes] = useState(0);
    const token = localStorage.getItem('login')
    ? JSON.parse(localStorage.getItem('login')).token
    : '';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/totalLikes', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                setTotalLikes(response.data.totalLikes);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
                <Typography variant="h6" align="center">
                    🚀 Likes totale
                </Typography>
                <Typography variant="h3" align="center">
                    {totalLikes}
                </Typography>
            </Paper>
        </Grid>
    );
};

export default CeptDash;
