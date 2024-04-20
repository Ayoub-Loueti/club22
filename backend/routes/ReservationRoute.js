//reservationmodel
const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ReservationController');
const authenticate = require('../middleware/authenticate');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Reservation = require('../models/ReservationModel');
const Utilisateur = require('../models/UtilisateurModel');
const Collaborateur = require('../models/CollaborateurModel');
const Offre = require('../models/OffreModel');
const Employe = require('../models/EmployeModel');

router.post('/reservation',authenticate, reservationController.createReservation);
router.get('/reservations', authenticate , reservationController.getAllReservations);
router.get('/reservation/:id', authenticate, reservationController.getReservationById);
//router.get('/myReservations', authenticate, reservationController.getUserReservations); 
router.put('/reservation/:id/annuler', authenticate, reservationController.annulerReservation);
router.put('/reservation/:id/confirmer', authenticate, reservationController.confirmationReservation);
//router.put('/updateReservation/:id', authenticate, reservationController.updateReservation);

router.get('/reservation/pdf/:id', authenticate, reservationController.generateReservationPDF);
router.get('/myReservations', authenticate, reservationController.getMyReservations);
router.put('/updateReservation/:id', authenticate, reservationController.modifyReservation);

//hotel

router.put('/hotel/:hotelId/modify', authenticate, reservationController.modifyHotelDetails);

module.exports = router;

/*

// Routes de réservation
router.post('/reservation', ReservationController.createReservation);
router.get('/reservations', ReservationController.getAllReservations);
router.get('/reservation/:id', ReservationController.getReservationById);
router.put('/reservation/:id', ReservationController.updateReservation);
router.delete('/reservation/:id', ReservationController.deleteReservation);
*/


