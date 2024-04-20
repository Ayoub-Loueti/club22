// Import necessary models and modules
const Reservation = require('../models/ReservationModel');
const Utilisateur = require('../models/UtilisateurModel');
const Collaborateur = require('../models/CollaborateurModel');
const Offre = require('../models/OffreModel');
const Employe = require('../models/EmployeModel');
const Hotel = require('../models/HotelModel');
const ImageOffre = require('../models/ImageOffreModel');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.createReservation = async (req, res) => {
  const { id_offre, nombre, prix_totale, hotels ,typeR} = req.body; // Extract hotels array from request body
  const userId = req.userId;

  if (nombre <= 0 || prix_totale <= 0) {
    return res.status(400).json({
      error: 'Invalid number of people or total price. Both must be greater than zero.',
    });
  }

  try {
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

    const offerExists = await Offre.findOne({ where: { id_offre } });
    if (!offerExists) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Create the reservation
    const reservation = await Reservation.create({
      id_offre,
      id_employe: employe.id_employe,
      nombre,
      prix_totale,
      date_reservation: new Date(),
      etat: 'en_cours',
      typeR,
    });

    // Create associated hotel records
    if (hotels && Array.isArray(hotels)) {
      await Promise.all(hotels.map(hotel => {
        return Hotel.create({
          id_reservation: reservation.id_reservation,
          nbr_adults: hotel.nbr_adults,
          nbr_enfants: hotel.nbr_enfants,
          prix: hotel.prix
        });
      }));
    }

    res.status(201).json({ message: 'Reservation and hotel details created successfully', reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    // Fetch all reservations from the database
    const reservations = await Reservation.findAll({
      include: [
        {
          model: Offre,
          as: 'offre', // alias to access offre information
          include: [
            {
              model: Collaborateur,
              as: 'collaborateur', // alias to access collaborateur information
            },
          ],
        },
        {
          model: Employe,
          as: 'employe', // alias to access employe information
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur', // alias to access utilisateur information
            },
          ],
        },
      ],
    });
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reservations' });
  }
};

exports.getReservationById = async (req, res) => {
  const { id } = req.params; 
  try {
    const reservation = await Reservation.findByPk(id, {
      include: [
        {
          model: Offre,
          as: 'offre', // alias to access offre information
          include: [
            {
              model: Collaborateur,
              as: 'collaborateur', // alias to access collaborateur information
            },
          ],
        },
        {
          model: Employe,
          as: 'employe', // alias to access employe information
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur', // alias to access utilisateur information
            },
          ],
        },
      ],
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.status(200).json(reservation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get reservation by ID' });
  }
};

exports.getUserReservations = async (req, res) => {
  const userId = req.userId;

  try {
    const employe = await Employe.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employe not found' });
    }

    const userReservations = await Reservation.findAll({
      where: {
        id_employe: employe.id_employe,
      },
      include: [
        {
          model: Offre,
          as: 'offre', 
          include: [
            {
              model: Collaborateur,
              as: 'collaborateur', 
            },
          ],
        },
      ],
    });

    res.status(200).json(userReservations);
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    res.status(500).json({ error: 'Failed to get user reservations' });
  }
};

exports.annulerReservation = async (req, res) => {
  const userId = req.userId;
  const reservationId = req.params.id; // Assuming reservation ID is passed as a parameter

  try {
    // Find the employee corresponding to the logged-in user
    const employe = await Employe.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find the reservation to be cancelled
    const userReservation = await Reservation.findOne({
      where: {
        id_employe: employe.id_employe,
        id_reservation: reservationId,
        etat: 'en_cours',
      },
    });

    if (!userReservation) {
      return res.status(404).json({ error: 'Reservation not found or cannot be cancelled' });
    }

    // Update the reservation state to 'annuler'
    await userReservation.update({ etat: 'annuler' });

    res.status(200).json({ message: 'Reservation cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
};

exports.confirmationReservation = async (req, res) => {
  const userId = req.userId;
  const reservationId = req.params.id; // Assuming reservation ID is passed as a parameter

  try {
    // Find the employee corresponding to the logged-in user
    const employe = await Employe.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find the reservation to be cancelled
    const userReservation = await Reservation.findOne({
      where: {
        id_employe: employe.id_employe,
        id_reservation: reservationId,
        etat: 'en_cours',
      },
    });

    if (!userReservation) {
      return res.status(404).json({ error: 'Reservation not found or cannot be cancelled' });
    }

    // Update the reservation state to 'annuler'
    await userReservation.update({ etat: 'confirmer' });

    res.status(200).json({ message: 'Reservation confirmer successfully' });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ error: 'Failed to confirm reservation' });
  }
};

exports.updateReservation = async (req, res) => {
  const userId = req.userId;
  const reservationId = req.params.id; // Assuming reservation ID is passed as a parameter
  const { id_offre } = req.body; // Assuming you want to update the offer ID

  try {
    // Find the employee corresponding to the logged-in user
    const employe = await Employe.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Find the reservation to be updated
    const userReservation = await Reservation.findOne({
      where: {
        id_employe: employe.id_employe,
        id_reservation: reservationId,
        etat: 'en_cours', // Only update reservations that are in progress
      },
    });

    if (!userReservation) {
      return res.status(404).json({ error: 'Reservation not found or cannot be updated' });
    }

    // Check if the new offer ID exists
    const newOfferExists = await Offre.findOne({
      where: {
        id_offre: id_offre,
      },
    });

    if (!newOfferExists) {
      return res.status(404).json({ error: 'New offer not found' });
    }

    // Update the reservation with the new offer ID
    await userReservation.update({ id_offre: id_offre });

    res.status(200).json({ message: 'Reservation updated successfully' });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation' });
  }
};

const generatePDF = async (reservationId) => {
  try {
      // Fetch reservation details from the database
      const reservation = await Reservation.findByPk(reservationId, {
          include: [
              {
                  model: Offre,
                  as: 'offre',
                  include: [
                      {
                          model: Collaborateur,
                          as: 'collaborateur',
                      },
                  ],
              },
              {
                  model: Employe,
                  as: 'employe',
              },
          ],
      });

      // Create a new PDF document
      const doc = new PDFDocument();
      doc.pipe(fs.createWriteStream(`reservation_${reservationId}.pdf`));

      // Write reservation details to the PDF
      doc.text(`Réservation #${reservation.id_reservation}`);
      doc.text(`Date de réservation: ${new Date(reservation.date_reservation).toLocaleDateString()}`);
      doc.text(`État: ${reservation.etat}`);
      doc.text(`Offre: ${reservation.offre.titre}`);
      doc.text(`Collaborateur: ${reservation.offre.collaborateur.nom}`);

      // Finalize the PDF document
      doc.end();
  } catch (error) {
      console.error('Error generating PDF:', error);
      throw error; // Re-throw the error to be handled elsewhere if needed
  }
};

exports.generateReservationPDF = async (req, res) => {
  const reservationId = req.params.id;
  try {
      await generatePDF(reservationId);
      res.status(200).json({ message: 'PDF generated successfully' });
  } catch (error) {
      console.error('Error generating reservation PDF:', error);
      res.status(500).json({ error: 'Failed to generate reservation PDF' });
  }
};

exports.getMyReservations = async (req, res) => {
  const userId = req.userId;

  try {
    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    let reservations = await Reservation.findAll({
      where: { id_employe: employe.id_employe },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            { model: Collaborateur, as: 'collaborateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        // Ensure other necessary models are included as needed
      ],
    });

    reservations = await Promise.all(reservations.map(async (reservation) => {
      const images = await ImageOffre.findAll({
        where: { id_offre: reservation.id_offre },
        attributes: ['image'],
      });

      const reservationJson = {
        ...reservation.toJSON(),
        offre: {
          ...reservation.offre.toJSON(),
          images: images.map(img => img.image),
        },
      };

      // Here's where we add the rooms details for hotel-type reservations
      if (reservation.typeR === 'hotel') {
        const hotels = await Hotel.findAll({
          where: { id_reservation: reservation.id_reservation },
          attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix']
        });

        const totalPeople = hotels.reduce((acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants, 0);
        reservationJson.nombreTotal = totalPeople;
        reservationJson.rooms = hotels;
      } else {
        // For non-hotel type reservations, use the reservation's nombre value
        reservationJson.nombreTotal = reservation.nombre;
      }

      return reservationJson;
    }));

    // Optionally sort reservations to have 'en_cours' first
    reservations.sort((a, b) => {
      if (a.etat === 'en_cours' && b.etat !== 'en_cours') return -1;
      if (a.etat !== 'en_cours' && b.etat === 'en_cours') return 1;
      return 0;
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

exports.modifyReservation = async (req, res) => {
  const { id } = req.params;  // Correctly extracting the 'id' parameter
  const { nombre, prix_totale, hotels } = req.body;

  try {
    const reservation = await Reservation.findByPk(id);  // Use 'id' not 'id_reservation'
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    await reservation.update({ nombre, prix_totale });

    // Update hotel details if any
    if (hotels && Array.isArray(hotels)) {
      for (const hotel of hotels) {
        const existingHotel = await Hotel.findByPk(hotel.id_hotel);
        if (existingHotel) {
          await existingHotel.update({
            nbr_adults: hotel.nbr_adults,
            nbr_enfants: hotel.nbr_enfants,
            prix: hotel.prix,
          });
        } else {
          // Handle the case where the hotel doesn't exist
          return res.status(404).json({ error: 'Hotel not found for id: ' + hotel.id_hotel });
        }
      }
    }

    return res.status(200).json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res.status(500).json({ error: 'Failed to update reservation', details: error.message });
  }
};

//hotel
exports.modifyHotelDetails = async (req, res) => {
  const { hotelId } = req.params; 
  const { nbr_adults, nbr_enfants, prix, prix_totale } = req.body; 
  const userId = req.userId; 

  try {
    // Retrieve the hotel along with associated reservation and employee details
    const hotel = await Hotel.findByPk(hotelId, {
      include: [{
        model: Reservation,
        as: 'reservation',
        include: [{
          model: Employe,  // Assuming 'Employe' is correctly related in ReservationModel
          as: 'employe'
        }]
      }]
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Authorization check: ensure the logged-in user is the employee who made the reservation
    if (hotel.reservation.employe.id_utilisateur !== userId) {
      return res.status(403).json({ message: 'User not authorized to update this hotel details' });
    }

    // Apply updates only for provided values
    if (nbr_adults !== undefined) hotel.nbr_adults = nbr_adults;
    if (nbr_enfants !== undefined) hotel.nbr_enfants = nbr_enfants;
    if (prix !== undefined) hotel.prix = prix;

    await hotel.save();

    // Optionally update the total price of the reservation
    if (prix_totale !== undefined) {
      const reservation = await Reservation.findByPk(hotel.id_reservation);
      if (!reservation) {
        return res.status(404).json({ message: 'Associated reservation not found' });
      }

      reservation.prix_totale = prix_totale;
      await reservation.save();
    }

    return res.status(200).json({ message: 'Hotel and reservation details updated successfully', hotel });
  } catch (error) {
    console.error('Error updating hotel details:', error);
    return res.status(500).json({ message: 'Error updating hotel details', error: error.message });
  }
};

module.exports = exports;