const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const authenticate = require('../middleware/authenticate');

router.get('/userstats', authenticate, dashboardController.calculateUserStats);
router.get('/adherentstats',authenticate, dashboardController.calculateAdherentStats);
router.get('/typestats',authenticate, dashboardController.reservationTypePercentage);
router.get('/totalPrixCollabs',authenticate, dashboardController.TotalPrixCollabs);
router.get('/reservationsCollabs',authenticate, dashboardController.totalReservationsCollabs);

module.exports = router;