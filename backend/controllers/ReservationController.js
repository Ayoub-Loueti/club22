const Reservation = require('../models/ReservationModel');
const Utilisateur = require('../models/UtilisateurModel');
const Collaborateur = require('../models/CollaborateurModel');
const Offre = require('../models/OffreModel');
const Employe = require('../models/EmployeModel');
const Hotel = require('../models/HotelModel');
const ImageOffre = require('../models/ImageOffreModel');
const { Op } = require('sequelize');
const ActiviteModel = require('../models/ActiviteModel');
const VoyageModel = require('../models/VoyageModel');
const GrandHotelModel = require('../models/GrandHotelModel');
const Evaluation = require('../models/EvaluationModel');

exports.createReservation = async (req, res) => {
  const {
    id_offre,
    nombre,
    prix_totale,
    hotels,
    typeR,
    date_debut,
    date_fin,
    mode_paiement,
    autorisation_deduction_salaire,
    date_paiement,
    montant_deduit,
    statut_paiement,
  } = req.body; // Extract hotels array from request body
  const userId = req.userId;

  if (nombre <= 0 || prix_totale <= 0) {
    return res.status(400).json({
      error:
        'Invalid number of people or total price. Both must be greater than zero.',
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

    const statut_paiement = mode_paiement === 'especes' ? 'paye_especes' : 'en_attente';
    // Create the reservation
    const reservation = await Reservation.create({
      id_offre,
      id_employe: employe.id_employe,
      nombre,
      prix_totale,
      date_reservation: new Date(),
      etat: 'en_cours',
      typeR,
      date_debut: new Date(date_debut),
      date_fin: new Date(date_fin),
      mode_paiement,
      autorisation_deduction_salaire,
      date_paiement,
      montant_deduit:prix_totale,
      statut_paiement,
    });

    // Create associated hotel records
    if (hotels && Array.isArray(hotels)) {
      await Promise.all(
        hotels.map((hotel) => {
          return Hotel.create({
            id_reservation: reservation.id_reservation,
            nbr_adults: hotel.nbr_adults,
            nbr_enfants: hotel.nbr_enfants,
            prix: hotel.prix,
          });
        })
      );
    }

    res
      .status(201)
      .json({
        message: 'Reservation and hotel details created successfully',
        reservation,
      });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

exports.getReservationDemande = async (req, res) => {
  const userId = req.userId;

  try {
    let reservations = await Reservation.findAll({
      where: {
        etat: ['confirmer', 'reparation'], // Filter by specified etat values
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            { model: Collaborateur, as: 'collaborateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        {
          model: Employe,
          as: 'employe',
          include: [
            { model: Utilisateur, as: 'utilisateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        // Ensure other necessary models are included as needed
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    // Optionally sort reservations to have 'en_cours' first
    reservations.sort((a, b) => {
      if (a.etat === 'en_cours' && b.etat !== 'en_cours') return -1;
      if (a.etat !== 'en_cours' && b.etat === 'en_cours') return 1;
      return 0;
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
};

exports.getReservationReponse = async (req, res) => {
  try {
    let reservations = await Reservation.findAll({
      where: {
        etat: ['accepter', 'refuser'], // Filter by specified etat values
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            { model: Collaborateur, as: 'collaborateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        {
          model: Employe,
          as: 'employe',
          include: [
            { model: Utilisateur, as: 'utilisateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        // Ensure other necessary models are included as needed
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    // Optionally sort reservations to have 'en_cours' first
    reservations.sort((a, b) => {
      if (a.etat === 'en_cours' && b.etat !== 'en_cours') return -1;
      if (a.etat !== 'en_cours' && b.etat === 'en_cours') return 1;
      return 0;
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
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
      return res
        .status(404)
        .json({ error: 'Reservation not found or cannot be cancelled' });
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
      return res
        .status(404)
        .json({ error: 'Reservation not found or cannot be cancelled' });
    }

    // Update the reservation state to 'annuler'
    await userReservation.update({ etat: 'confirmer' });

    res.status(200).json({ message: 'Reservation confirmer successfully' });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ error: 'Failed to confirm reservation' });
  }
};

exports.reparationReservation = async (req, res) => {
  const userId = req.userId;
  const reservationId = req.params.id; // Assuming reservation ID is passed as a parameter

  try {
    // Find the employee corresponding to the logged-in user
    const admin = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: 'admin not found' });
    }

    // Find the reservation to be cancelled
    const userReservation = await Reservation.findOne({
      where: {
        id_reservation: reservationId,
        etat: 'confirmer',
      },
    });

    if (!userReservation) {
      return res
        .status(404)
        .json({ error: 'Reservation not found or cannot be cancelled' });
    }

    // Update the reservation state to 'annuler'
    await userReservation.update({ etat: 'reparation' });

    res.status(200).json({ message: 'Reservation reparation successfully' });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ error: 'Failed to confirm reservation' });
  }
};

exports.reparationReservations = async (req, res) => {
  const userId = req.userId;
  const reservationIds = req.body.reservationIds; // Assuming reservation IDs are passed in the request body as an array

  try {
    // Find the employee corresponding to the logged-in user
    const admin = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: 'admin not found' });
    }

    // Find and update all reservations in the list
    await Promise.all(
      reservationIds.map(async (reservationId) => {
        // Find the reservation to be repaired
        const userReservation = await Reservation.findOne({
          where: {
            id_reservation: reservationId,
            etat: 'confirmer',
          },
        });

        if (!userReservation) {
          console.error(`Reservation with ID ${reservationId} not found or cannot be repaired`);
          // Return or continue depending on your requirements
        }

        // Update the reservation state to 'reparation'
        await userReservation.update({ etat: 'reparation' });
      })
    );

    res.status(200).json({ message: 'Reservations repaired successfully' });
  } catch (error) {
    console.error('Error repairing reservations:', error);
    res.status(500).json({ error: 'Failed to repair reservations' });
  }
};

exports.acceptationReservation = async (req, res) => {
  const userId = req.userId;
  const reservationId = req.params.id; // Assuming reservation ID is passed as a parameter

  try {
    // Find the employee corresponding to the logged-in user
    const admin = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: 'admin not found' });
    }

    // Find the reservation to be cancelled
    const userReservation = await Reservation.findOne({
      where: {
        id_reservation: reservationId,
        etat: 'reparation',
      },
    });

    if (!userReservation) {
      return res
        .status(404)
        .json({ error: 'Reservation not found or cannot be cancelled' });
    }

    // Update the reservation state to 'annuler'
    await userReservation.update({ etat: 'accepter', statut_paiement: 'accepte' });

    res.status(200).json({ message: 'Reservation accepted successfully' });
  } catch (error) {
    console.error('Error confirming reservation:', error);
    res.status(500).json({ error: 'Failed to confirm reservation' });
  }
};

exports.refuserReservation = async (req, res) => {
  const userId = req.userId;
  const reservationId = req.params.id; // Assuming reservation ID is passed as a parameter

  try {
    // Find the employee corresponding to the logged-in user
    const admin = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
      },
    });

    if (!admin) {
      return res.status(404).json({ error: 'admin not found' });
    }

    // Find the reservation to be cancelled
    const userReservation = await Reservation.findOne({
      where: {
        id_reservation: reservationId,
        etat: 'reparation',
      },
    });

    if (!userReservation) {
      return res
        .status(404)
        .json({ error: 'Reservation not found or cannot be cancelled' });
    }

    // Update the reservation state to 'annuler'
    await userReservation.update({ etat: 'refuser', statut_paiement: 'refuse' });

    res.status(200).json({ message: 'Reservation refused successfully' });
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
      return res
        .status(404)
        .json({ error: 'Reservation not found or cannot be updated' });
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

/* const generatePDF = async (reservationId) => {
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
}; */

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
      where: {
        id_employe: employe.id_employe,
        etat: ['en_cours', 'annuler'], // Filter by specified etat values
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            { model: Collaborateur, as: 'collaborateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        {
          model: Employe,
          as: 'employe',
          include: [
            { model: Utilisateur, as: 'utilisateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        // Ensure other necessary models are included as needed
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    // Optionally sort reservations to have 'en_cours' first
    reservations.sort((a, b) => {
      if (a.etat === 'en_cours' && b.etat !== 'en_cours') return -1;
      if (a.etat !== 'en_cours' && b.etat === 'en_cours') return 1;
      return 0;
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
};

exports.getMyReservationsBoxD = async (req, res) => {
  const userId = req.userId;

  try {
    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    let reservations = await Reservation.findAll({
      where: {
        id_employe: employe.id_employe,
        etat: ['confirmer', 'reparation'], // Filter by specified etat values
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            { model: Collaborateur, as: 'collaborateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        {
          model: Employe,
          as: 'employe',
          include: [
            { model: Utilisateur, as: 'utilisateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        // Ensure other necessary models are included as needed
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    // Optionally sort reservations to have 'en_cours' first
    reservations.sort((a, b) => {
      if (a.etat === 'en_cours' && b.etat !== 'en_cours') return -1;
      if (a.etat !== 'en_cours' && b.etat === 'en_cours') return 1;
      return 0;
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
};

exports.getMyReservationsBoxT = async (req, res) => {
  const userId = req.userId;

  try {
    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    let reservations = await Reservation.findAll({
      where: {
        id_employe: employe.id_employe,
        etat: ['accepter', 'refuser'], // Filter by specified etat values
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          include: [
            { model: Collaborateur, as: 'collaborateur' },
            // Ensure other necessary models are included as needed
          ],
        },
        {
          model: Employe,
          as: 'employe',
          include: [{ model: Utilisateur, as: 'utilisateur' }],
        },
        // Ensure other necessary models are included as needed
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    // Optionally sort reservations to have 'en_cours' first
    reservations.sort((a, b) => {
      if (a.etat === 'en_cours' && b.etat !== 'en_cours') return -1;
      if (a.etat !== 'en_cours' && b.etat === 'en_cours') return 1;
      return 0;
    });

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({ error: 'Internal server error', details: error.message });
  }
};

exports.modifyReservation = async (req, res) => {
  const { id } = req.params; // Correctly extracting the 'id' parameter
  const {
    nombre,
    prix_totale,
    hotels,
    mode_paiement,
    autorisation_deduction_salaire,
  } = req.body;

  try {
    const reservation = await Reservation.findByPk(id); // Use 'id' not 'id_reservation'
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }

    await reservation.update({
      nombre,
      prix_totale,
      mode_paiement,
      autorisation_deduction_salaire,
    });

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
          return res
            .status(404)
            .json({ error: 'Hotel not found for id: ' + hotel.id_hotel });
        }
      }
    }

    return res
      .status(200)
      .json({ message: 'Reservation updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation:', error);
    res
      .status(500)
      .json({ error: 'Failed to update reservation', details: error.message });
  }
};

exports.getReservByCollabA = async (req, res) => {
  const collaboratorId = req.params.collaboratorId;

  try {
    const collaborator = await Collaborateur.findByPk(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    let reservations = await Reservation.findAll({
      where: {
        etat: ['confirmer', 'reparation'],
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          where: {
            id_collaborateur: collaboratorId,
          },
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
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
            },
          ],
        },
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to get reservations' });
  }
};

exports.getReservByCollabB = async (req, res) => {
  const collaboratorId = req.params.collaboratorId;

  try {
    const collaborator = await Collaborateur.findByPk(collaboratorId);
    if (!collaborator) {
      return res.status(404).json({ error: 'Collaborator not found' });
    }

    let reservations = await Reservation.findAll({
      where: {
        etat: ['accepter', 'refuser'],
      },
      include: [
        {
          model: Offre,
          as: 'offre',
          where: {
            id_collaborateur: collaboratorId,
          },
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
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
            },
          ],
        },
      ],
    });

    reservations = await Promise.all(
      reservations.map(async (reservation) => {
        const images = await ImageOffre.findAll({
          where: { id_offre: reservation.id_offre },
          attributes: ['image'],
        });

        const reservationJson = {
          ...reservation.toJSON(),
          offre: {
            ...reservation.offre.toJSON(),
            images: images.map((img) => img.image),
          },
        };

        switch (reservation.offre.type) {
          case 'hotel':
            reservationJson.details = await GrandHotelModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'voyage':
            reservationJson.details = await VoyageModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
          case 'activite':
            reservationJson.details = await ActiviteModel.findOne({
              where: { id_offre: reservation.id_offre },
            });
            break;
        }

        // Here's where we add the rooms details for hotel-type reservations
        if (reservation.typeR === 'hotel') {
          const hotels = await Hotel.findAll({
            where: { id_reservation: reservation.id_reservation },
            attributes: ['id_hotel', 'nbr_adults', 'nbr_enfants', 'prix'],
          });

          const totalPeople = hotels.reduce(
            (acc, hotel) => acc + hotel.nbr_adults + hotel.nbr_enfants,
            0
          );
          reservationJson.nombreTotal = totalPeople;
          reservationJson.rooms = hotels;
        } else {
          // For non-hotel type reservations, use the reservation's nombre value
          reservationJson.nombreTotal = reservation.nombre;
        }

        return reservationJson;
      })
    );

    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to get reservations' });
  }
};

//hotel

exports.deleteHotel = async (req, res) => {
  const { id } = req.params; // This is the hotel ID to be deleted

  try {
    const hotel = await Hotel.findByPk(id);

    if (!hotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    await hotel.destroy(); // Deletes the hotel from the database
    return res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res
      .status(500)
      .json({ error: 'Failed to delete hotel', details: error.message });
  }
};

//vote

exports.createEvaluation = async (req, res) => {
  const { id_offre, vote } = req.body;
  const userId = req.userId; // Assumed to be set by your authentication middleware

  try {
    // Retrieve the employe ID using the user ID from the token
    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const id_employe = employe.id_employe;

    // Check if the id_offre and id_employe exist together in a reservation
    const existingReservation = await Reservation.findOne({
      where: {
        id_offre: id_offre,
        id_employe: id_employe,
      },
    });

    if (!existingReservation) {
      return res
        .status(404)
        .json({
          error:
            'No reservation found with the provided employee and offer IDs.',
        });
    }

    // Check if an evaluation already exists with the same id_offre and id_employe
    const existingEvaluation = await Evaluation.findOne({
      where: {
        id_offre: id_offre,
        id_employe: id_employe,
      },
    });

    if (existingEvaluation) {
      // Update the existing evaluation's vote
      await existingEvaluation.update({ vote: vote });
      return res
        .status(200)
        .json({
          message: 'Evaluation updated successfully',
          evaluation: existingEvaluation,
        });
    }

    // Create a new evaluation if it does not exist
    const newEvaluation = await Evaluation.create({
      id_offre: id_offre,
      id_employe: id_employe,
      vote: vote,
    });

    res
      .status(201)
      .json({
        message: 'Evaluation created successfully',
        evaluation: newEvaluation,
      });
  } catch (error) {
    console.error('Failed to create or update evaluation:', error);
    res
      .status(500)
      .json({
        error: 'Failed to create or update evaluation',
        details: error.message,
      });
  }
};

exports.getOffreVote = async (req, res) => {
  const { offreId } = req.params; // Getting the offer ID from the request parameters

  try {
    // First, check if the offre exists to provide a meaningful error if it doesn't
    const offre = await Offre.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    // Retrieve all evaluations for the given offre ID
    const evaluations = await Evaluation.findAll({
      where: { id_offre: offreId },
    });

    const totalVotes = evaluations.reduce(
      (sum, evaluation) => sum + evaluation.vote,
      0
    );
    const numberOfEvaluations = evaluations.length;
    const averageVotes =
      numberOfEvaluations > 0
        ? (totalVotes / numberOfEvaluations).toFixed(2)
        : 0;

    // Construct response with total votes, number of evaluations, and average votes
    const response = {
      id_offre: offreId,
      totalVotes: totalVotes,
      numberOfEvaluations: numberOfEvaluations,
      averageVotes: parseFloat(averageVotes), // Ensure the response is a number even if it was calculated as zero
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to get votes for offre:', error);
    res
      .status(500)
      .json({
        error: 'Failed to retrieve offer votes',
        details: error.message,
      });
  }
};

exports.getVoteByOffreAndEmployee = async (req, res) => {
  const { offreId } = req.params; // Getting the offer ID from the request parameters
  const userId = req.userId; // Assumed to be set by your authentication middleware

  try {
    // Retrieve the employe ID using the user ID from the token
    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
    });

    if (!employe) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const id_employe = employe.id_employe;

    // Retrieve the specific evaluation for the given offre ID and employe ID
    const evaluation = await Evaluation.findOne({
      where: {
        id_offre: offreId,
        id_employe: id_employe,
      },
    });

    if (!evaluation) {
      return res
        .status(200)
        .json({
          message: 'Evaluation not found for the specified offer and employee.',
        });
    }

    // Return the found evaluation
    res.status(200).json({
      id_offre: offreId,
      id_employe: id_employe,
      vote: evaluation.vote,
    });
  } catch (error) {
    console.error('Failed to get vote:', error);
    res
      .status(500)
      .json({ error: 'Failed to retrieve vote', details: error.message });
  }
};

module.exports = exports;
