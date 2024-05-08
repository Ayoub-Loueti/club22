import React, { useEffect, useState } from 'react';
import { Typography, Paper, Grid } from '@mui/material';
import axios from 'axios';

const SixDash = () => {
    const [data, setData] = useState([]);
    const token = localStorage.getItem('login')
        ? JSON.parse(localStorage.getItem('login')).token
        : '';
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/TotalPrixCollabs',
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={{ height: '400px' , display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography variant="h6">Collaborateurs revenu</Typography>
            {data.map((collab) => (
                <Paper
                    key={collab.collaboratorName}
                    elevation={3}
                    style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}
                >
                    <Typography>{collab.collaboratorName}</Typography>
                    <Typography>{collab.totalPrix} Dt</Typography>
                </Paper>
            ))}
        </div>
    );
};

export default SixDash;
