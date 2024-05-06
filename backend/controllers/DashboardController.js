const Utilisateur = require('../models/UtilisateurModel');
const Employe = require('../models/EmployeModel');
const Reservation = require('../models/ReservationModel');
const Collaborateur = require('../models/CollaborateurModel');
const Offre = require('../models/OffreModel');
const { Op } = require('sequelize');


exports.calculateUserStats = async (req, res) => {
    try {
      const clientsCount = await Utilisateur.count({ where: { type: 'client', etat: 'autorise' } });
      const employesCount = await Utilisateur.count({ where: { type: 'employe', etat: 'autorise' } });
      const totalUsersCount = await Utilisateur.count({ where: { [Op.not]: { type: 'admin' }, etat: 'autorise' } });
      const clientsPercentage = ((clientsCount / totalUsersCount) * 100).toFixed(2);
      const employesPercentage = ((employesCount / totalUsersCount) * 100).toFixed(2);
  
      res.status(200).json({
        clientsCount,
        employesCount,
        totalUsersCount,
        clientsPercentage,
        employesPercentage,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
};

exports.calculateAdherentStats = async (req, res) => {
    try {
        const adherentCount = await Employe.count({ where: { adherant: true } });
        const nonAdherentCount = await Employe.count({ where: { adherant: false } });
        const totalEmployeesCount = await Employe.count();
        const adherentPercentage = ((adherentCount / totalEmployeesCount) * 100).toFixed(2);
        const nonAdherentPercentage = ((nonAdherentCount / totalEmployeesCount) * 100).toFixed(2);

        res.status(200).json({
            adherentCount,
            nonAdherentCount,
            totalEmployeesCount,
            adherentPercentage,
            nonAdherentPercentage,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reservationTypePercentage = async (req, res) => {
    try {
        const totalAcceptedReservationsCount = await Reservation.count({ where: { etat: 'accepter' } });
        const activiteCount = await Reservation.count({ where: { etat: 'accepter', typeR: 'activité' } });
        const hotelCount = await Reservation.count({ where: { etat: 'accepter', typeR: 'hotel' } });
        const voyageCount = await Reservation.count({ where: { etat: 'accepter', typeR: 'voyage' } });
        const autreCount = await Reservation.count({ where: { etat: 'accepter', typeR: 'autre' } });

        const activitePercentage = ((activiteCount / totalAcceptedReservationsCount) * 100).toFixed(2);
        const hotelPercentage = ((hotelCount / totalAcceptedReservationsCount) * 100).toFixed(2);
        const voyagePercentage = ((voyageCount / totalAcceptedReservationsCount) * 100).toFixed(2);
        const autrePercentage = ((autreCount / totalAcceptedReservationsCount) * 100).toFixed(2);

        res.status(200).json({
            activitePercentage,
            hotelPercentage,
            voyagePercentage,
            autrePercentage,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.TotalPrixCollabs = async (req, res) => {
    try {
        const collaborators = await Collaborateur.findAll();

        const results = [];

        for (const collaborator of collaborators) {
            const offers = await Offre.findAll({
                where: { id_collaborateur: collaborator.id_collaborateur },
            });

            let totalPrix = 0;

            for (const offer of offers) {
                const reservations = await Reservation.findAll({
                    where: { id_offre: offer.id_offre, etat: 'accepter' },
                });

                for (const reservation of reservations) {
                    totalPrix += reservation.prix_totale;
                }
            }
            results.push({
                collaboratorName: collaborator.nom,
                totalPrix: totalPrix,
            });
        }

        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.totalReservationsCollabs = async (req, res) => {
    try {
        const collaborators = await Collaborateur.findAll();
        const result = [];

        for (const collaborator of collaborators) {
            const totalReservations = await Reservation.count({
                where: {
                    '$offre.collaborateur.id_collaborateur$': collaborator.id_collaborateur,
                    etat: 'accepter',
                },
                include: [{
                    model: Offre,
                    as: 'offre',
                    include: [{
                        model: Collaborateur,
                        as: 'collaborateur',
                    }]
                }]
            });

            result.push({
                collaborateur: collaborator.nom,
                totalReservations,
            });
        }

        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = exports;
