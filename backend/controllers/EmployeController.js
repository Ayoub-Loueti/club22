const Demande = require('../models/DemandeModel');
const Employe = require('../models/EmployeModel');
const Utilisateur = require('../models/UtilisateurModel');

exports.createDemande = async (req, res) => {
    try {
        const userId = req.userId;
        const { description } = req.body;

        const isEmploye = await Utilisateur.findOne({
            where: {
                id_utilisateur: userId,
                type: 'employe',
            },
        });

        if (!isEmploye) {
            return res.status(403).json({
                error: 'Permission denied. Only employees can create requests.',
            });
        }

        const employe = await Employe.findOne({
            where: { id_utilisateur: userId },
        });

        if (!employe) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Check if the employee is adherent or non-adherent
        if (employe.adherant) {
            // If adherent, default title is 'annulation du contrat adhérant'
            const defaultTitle = 'annulation du contrat adhérant';
            const existingDemande = await Demande.findOne({
                where: {
                    id_employe: employe.id_employe,
                    titre: defaultTitle,
                },
            });

            if (existingDemande) {
                return res.status(400).json({ error: 'Demande already sent' });
            }

            // If no existing demande, create one
            const demande = await Demande.create({
                id_employe: employe.id_employe,
                titre: defaultTitle,
                description:description,
                date_demande: new Date(),
            });

            return res.status(201).json({ demande });
        } else {
            // If non-adherent, default title is 'devenir un adherant'
            const defaultTitle = 'devenir un adherant';
            const existingDemande = await Demande.findOne({
                where: {
                    id_employe: employe.id_employe,
                    titre: defaultTitle,
                },
            });

            if (existingDemande) {
                return res.status(400).json({ error: 'Demande already sent' });
            }

            // If no existing demande, create one
            const demande = await Demande.create({
                id_employe: employe.id_employe,
                titre: defaultTitle,
                description:description,
                date_demande: new Date(),
            });

            return res.status(201).json({ demande });
        }
    } catch (error) {
        console.error('Error creating demande:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = exports;
