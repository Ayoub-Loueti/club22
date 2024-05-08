const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');
const authenticate = require('../middleware/authenticate');

// 1 => client % employe 
router.get('/userstats', authenticate, dashboardController.calculateUserStats);

// 2 => adherant % non adherant 
router.get('/adherentstats',authenticate, dashboardController.calculateAdherentStats);

// 3 => activite % voyage % hotel
router.get('/typestats',authenticate, dashboardController.reservationTypePercentage);

// 4 => flous les collabs
router.get('/totalPrixCollabs',authenticate, dashboardController.TotalPrixCollabs);

// 5 => totalReservations for collabs
router.get('/reservationsCollabs',authenticate, dashboardController.totalReservationsCollabs);

// 6 => evaluation de collab
router.get('/evaluationsByCollab', authenticate, dashboardController.EvaluationsByCollab);

// 7 => Total likes
router.get('/totalLikes', authenticate, dashboardController.totalLikes);

// 8 => Total comments
router.get('/totalComments', authenticate, dashboardController.totalComments);

// 9 => Total Users
router.get('/totalUsers', authenticate, dashboardController.totalUsers);

module.exports = router;