// Import necessary models and modules
const Reservation = require('../models/ReservationModel');
const Utilisateur = require('../models/UtilisateurModel');
const Collaborateur = require('../models/CollaborateurModel');
const Offre = require('../models/OffreModel');
const Employe = require('../models/EmployeModel');

exports.createReservation = async (req, res) => {
  const {id_offre} = req.body;
  const userId = req.userId;

  try {
    // Find the id_employe corresponding to the userId
    const isEmploye = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
        type: 'employe',
      },
    });

    if (!isEmploye) {
      return res.status(403).json({
        error: 'Permission denied. Only employees can reserve offers.',
      });
    }

    const [employe, created] = await Employe.findOrCreate({
      where: { id_utilisateur: userId },
    });


    // Check if the offer exists
    const offerExists = await Offre.findOne({
      where: {
        id_offre: id_offre,
      },
    });

    if (!offerExists) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Create the reservation
    const reservation = await Reservation.create({
      id_offre: id_offre,
      id_employe: employe.id_employe,
      date_reservation: new Date(),
    });

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
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
  const { id } = req.params; // Extract the reservation ID from the request parameters
  try {
    // Fetch the reservation from the database by its ID
    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      // If reservation with the provided ID is not found, return a 404 error
      return res.status(404).json({ error: 'Reservation not found' });
    }
    // If reservation is found, return it in the response
    res.status(200).json(reservation);
  } catch (error) {
    // If an error occurs, return a 500 error with the error message
    res.status(500).json({ error: 'Failed to get reservation by ID' });
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
