// Import necessary models and modules
const Reservation = require('../models/ReservationModel');
const Utilisateur = require('../models/UtilisateurModel');
const { validationResult } = require('express-validator');

// Controller function to create a reservation
exports.createReservation = async (req, res) => {
  // Validate request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Create the reservation using data from the request body
    const reservation = await Reservation.create(req.body);
    res.status(201).json({ reservation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

// Controller function to get all reservations
exports.getAllReservations = async (req, res) => {
  try {
    // Fetch all reservations from the database
    const reservations = await Reservation.findAll();
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reservations' });
  }
};

// Controller function to get a reservation by ID
exports.getReservationById = async (req, res) => {
  const { reservationId } = req.params;
  try {
    // Find the reservation by ID
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reservation' });
  }
};

// Controller function to update a reservation
exports.updateReservation = async (req, res) => {
  const { reservationId } = req.params;
  try {
    // Find the reservation by ID
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Update the reservation with data from the request body
    await reservation.update(req.body);
    res.status(200).json({ message: 'Reservation updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};

// Controller function to delete a reservation
exports.deleteReservation = async (req, res) => {
  const { reservationId } = req.params;
  try {
    // Find the reservation by ID
    const reservation = await Reservation.findByPk(reservationId);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    // Delete the reservation
    await reservation.destroy();
    res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete reservation' });
  }
};

// Other reservation-related controller functions can be added here as needed

module.exports = exports;
