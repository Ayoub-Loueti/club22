const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/ReservationController');
const authenticate = require('../middleware/authenticate');

router.post('/reservation',authenticate, reservationController.createReservation);
router.get('/reservations', authenticate , reservationController.getAllReservations);
router.get('/reservation/:id', authenticate, reservationController.getReservationById);

/*

// Routes de réservation
router.post('/reservation', ReservationController.createReservation);
router.get('/reservations', ReservationController.getAllReservations);
router.get('/reservation/:id', ReservationController.getReservationById);
router.put('/reservation/:id', ReservationController.updateReservation);
router.delete('/reservation/:id', ReservationController.deleteReservation);
*/
module.exports = router;


