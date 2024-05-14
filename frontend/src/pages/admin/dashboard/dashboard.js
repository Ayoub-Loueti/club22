import React, { useState } from 'react';
import { Grid, Paper, IconButton } from '@mui/material';
import { ArrowForward, ArrowBack } from '@mui/icons-material';
import UneDash from './UneDash';
import DeuxDash from './DeuxDash';
import TroixDash from './TroixDash';
import QuatreDash from './QuatreDash';
import CinqueDash from './CinqueDash';
import SixDash from './SixDash';
import CeptDash from './CeptDash';
import NavAdmin from '../NavAdmin/navAdmin';

const Dashboard = () => {
    const [showQuatre, setShowQuatre] = useState(true);
    const [showSix, setShowSix] = useState(false);

    const toggleDashboards = () => {
        setShowQuatre((prev) => !prev);
    };

    const toggleDashboardss = () => {
        setShowSix((prev) => !prev);
    };
    return (
      <>
        <NavAdmin />
        <Grid
          container
          spacing={2}
          style={{ padding: '30px', backgroundColor: '#d3d3d3',marginTop:'5px' }}
        >
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                  }}
                >
                  <UneDash />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                  }}
                >
                  <DeuxDash />
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    maxHeight: '500px',
                    overflowY: 'auto',
                  }}
                >
                  <TroixDash />
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              <Grid item xs={12} md={8}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    position: 'relative',
                    maxHeight: '550px',
                    overflowY: 'auto',
                  }}
                >
                  {showQuatre ? <QuatreDash /> : <CinqueDash />}
                  <IconButton
                    aria-label="toggle dashboard"
                    onClick={toggleDashboards}
                    size="medium"
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 25,
                      zIndex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {showQuatre ? <ArrowForward /> : <ArrowBack />}
                  </IconButton>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={3}
                  style={{
                    padding: '10px',
                    position: 'relative',
                    maxHeight: '550px',
                    overflowY: 'auto',
                  }}
                >
                  {showSix ? <CeptDash /> : <SixDash />}
                  <IconButton
                    aria-label="toggle dashboard"
                    onClick={toggleDashboardss}
                    size="medium"
                    style={{
                      position: 'absolute',
                      top: 5,
                      right: 10,
                      zIndex: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid #ccc',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    }}
                  >
                    {showSix ? <ArrowForward /> : <ArrowBack />}
                  </IconButton>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
};

export default Dashboard;
