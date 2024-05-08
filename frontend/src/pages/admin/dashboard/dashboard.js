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

    const toggleDashboards = () => {
        setShowQuatre((prev) => !prev);
    };

    return (
        <>
            <NavAdmin />
            <Grid container spacing={2}>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} style={{ padding: '10px' }}>
                                <UneDash />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} style={{ padding: '10px' }}>
                                <DeuxDash />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} style={{ padding: '10px' }}>
                                <TroixDash />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={2}>
                    <Grid item xs={12} md={8}>
                     <Paper elevation={3} style={{ padding: '10px', position: 'relative' }}>
                        {showQuatre ? <QuatreDash /> : <CinqueDash />}
                        <IconButton
                        aria-label="toggle dashboard"
                        onClick={toggleDashboards}
                        size="small"
                        style={{ position: 'absolute', top: 5, right: 5, zIndex: 1 }}
                        >
                        {showQuatre ? <ArrowForward /> : <ArrowBack />}
                        </IconButton>
                    </Paper>
                    </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} style={{ padding: '10px' }}>
                                <SixDash />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                
            </Grid>
        </>
    );
};

export default Dashboard;
