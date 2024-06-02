import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
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
          'http://54.242.240.123/TotalPrixCollabs',
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
  const getColor = (totalPrix) => {
    if (totalPrix > 10000) return '#c8e6c9'; // Vert pour les revenus élevés
    if (totalPrix > 5000) return '#fff9c4'; // Jaune pour les revenus moyens
    return '#ffcdd2'; // Rouge pour les revenus faibles
  };
  return (
    <div
      style={{
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <Typography variant="h6">Collaborateurs revenu</Typography>
      {data.map((collab) => (
        <Paper
          key={collab.collaboratorName}
          elevation={3}
          style={{
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: getColor(collab.totalPrix),
          }}
        >
          <Typography>{collab.collaboratorName}</Typography>
          <Typography>{collab.totalPrix} Dt</Typography>
        </Paper>
      ))}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#c8e6c9',
              marginRight: '5px',
            }}
          ></div>
          <Typography style={{ fontSize: '0.57rem' }}>
            Revenus élevés (&gt;10000 Dt)
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#fff9c4',
              marginRight: '5px',
            }}
          ></div>
          <Typography style={{ fontSize: '0.57rem' }}>
            Revenus moyens (5000 - 10000 Dt)
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              backgroundColor: '#ffcdd2',
              marginRight: '5px',
            }}
          ></div>
          <Typography style={{ fontSize: '0.57rem' }}>
            Revenus faibles (&lt;5000 Dt)
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default SixDash;
