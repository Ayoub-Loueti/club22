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
router.get('/reservationsDe', authenticate , reservationController.getReservationDemande);
router.get('/reservationsRe', authenticate , reservationController.getReservationReponse);
router.get('/reservation/:id', authenticate, reservationController.getReservationById);
//router.get('/myReservations', authenticate, reservationController.getUserReservations); 
router.put('/reservation/:id/annuler', authenticate, reservationController.annulerReservation);
router.put('/reservation/:id/confirmer', authenticate, reservationController.confirmationReservation);
router.put('/reservation/:id/reparer', authenticate, reservationController.reparationReservation);
router.put('/reservation/:id/accepter', authenticate, reservationController.acceptationReservation);
router.put('/reservation/:id/refuser', authenticate, reservationController.refuserReservation);

//router.put('/updateReservation/:id', authenticate, reservationController.updateReservation);

router.get('/reservation/pdf/:id', authenticate, reservationController.generateReservationPDF);
router.get('/myReservations', authenticate, reservationController.getMyReservations);
router.get('/myReservationsBoxD', authenticate, reservationController.getMyReservationsBoxD);
router.get('/myReservationsBoxT', authenticate, reservationController.getMyReservationsBoxT);
router.put('/updateReservation/:id', authenticate, reservationController.modifyReservation);

//hotel

router.delete('/hotel/:id', authenticate, reservationController.deleteHotel);

module.exports = router;

/*

// Routes de réservation
router.post('/reservation', ReservationController.createReservation);
router.get('/reservations', ReservationController.getAllReservations);
router.get('/reservation/:id', ReservationController.getReservationById);
router.put('/reservation/:id', ReservationController.updateReservation);
router.delete('/reservation/:id', ReservationController.deleteReservation);
*/


