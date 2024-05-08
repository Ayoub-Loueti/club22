import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

const CeptDash = () => {
    const [totalLikes, setTotalLikes] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const token = localStorage.getItem('login')
       ? JSON.parse(localStorage.getItem('login')).token
        : '';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const likesResponse = await axios.get('http://localhost:5000/totalLikes', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalLikes(likesResponse.data.totalLikes);

                const commentsResponse = await axios.get('http://localhost:5000/totalComments', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalComments(commentsResponse.data.totalComments);

                const usersResponse = await axios.get('http://localhost:5000/totalUsers', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalUsersCount(usersResponse.data.totalUsersCount);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid container spacing={2} style={{ height: '400px' }}>
            {/* Adjusted xs prop to 12 for vertical stacking */}
            <Grid item xs={12} >
                <Paper elevation={3} style={{ padding: '10px', backgroundColor: 'blue', color: 'white', height: '100%' }}>
                    <Typography variant="h6" align="center">
                        🚀 Likes totale
                    </Typography>
                    <Typography variant="h3" align="center">
                        {totalLikes}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} >
                <Paper elevation={3} style={{ padding: '10px', backgroundColor: 'green', color: 'white', height: '100%' }}>
                    <Typography variant="h6" align="center">
                        💬 Comments totale
                    </Typography>
                    <Typography variant="h3" align="center">
                        {totalComments}
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} >
                <Paper elevation={3} style={{ padding: '10px', backgroundColor: 'purple', color: 'white', height: '100%' }}>
                    <Typography variant="h6" align="center">
                        👥 Total Users
                    </Typography>
                    <Typography variant="h3" align="center">
                        {totalUsersCount}
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default CeptDash;