const Demande = require('../models/DemandeModel');
const Employe = require('../models/EmployeModel');
const Utilisateur = require('../models/UtilisateurModel');
const Reclamation = require('../models/ReclamationModel');
exports.createDemande = async (req, res) => {
    try {
        const userId = req.userId;
        const { description, signature } = req.body;

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
              description: description,
              signature:signature,
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
              description: description,
              signature: signature,
              date_demande: new Date(),
            });

            return res.status(201).json({ demande });
        }
    } catch (error) {
        console.error('Error creating demande:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.isAdherant = async (req, res) => {
    try {
      const userId = req.userId; // Assuming userId is set by your authentication middleware
  
      const employe = await Employe.findOne({
        include: [{
          model: Utilisateur,
          as: 'utilisateur',
          where: { id_utilisateur: userId }
        }]
      });
  
      if (!employe) {
        return res.status(404).send({ message: 'Employee not found' });
      }
  
      return res.status(200).send({ adherant: employe.adherant });
    } catch (error) {
      console.error('Error checking adherant status:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };
  

exports.createReclamation = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is set by your authentication middleware
    const { contenu } = req.body;

    // Check if the user is an employee
    const isEmploye = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
        type: 'employe',
      },
    });

    if (!isEmploye) {
      return res.status(403).json({
        error: 'Permission denied. Only employees can create reclamations.',
      });
    }

    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
    });

    if (!employe.adherant) {
      return res.status(403).json({
        message: 'Only adherent employees can create reclamations.',
      });
    }

    const newReclamation = await Reclamation.create({
      contenu,
      id_employe: employe.id_employe,
      statut: 'En attente',
    });

    res.status(201).json(newReclamation);
  } catch (error) {
    console.error('Error creating reclamation:', error);
    res.status(500).json({
      message: 'Error creating reclamation',
      error: error.message,
    });
  }
};
exports.getEmployeDetails = async (req, res) => {
  try {
    const userId = req.userId; // Assurez-vous que l'ID de l'utilisateur est correctement extrait de la requête (peut-être via un middleware d'authentification)

    const employe = await Employe.findOne({
      where: { id_utilisateur: userId },
      include: [
        {
          model: Utilisateur,
          as: 'utilisateur',
          attributes: ['nom', 'prenom'], 
        },
      ],
    });

    if (!employe) {
      return res.status(404).json({ message: 'Employé non trouvé' });
    }

    res.json({
      id_employe: employe.id_employe,
      nom: employe.utilisateur.nom,
      prenom: employe.utilisateur.prenom,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des détails de l'employé:",
      error
    );
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

  exports.getReclamationsByEmploye = async (req, res) => {
    try {
      const userId = req.userId; // Assuming userId is set by your authentication middleware
      const { id_employe } = req.params;

      // Verify that the requesting user is the same as the employee or has appropriate permissions
      const employe = await Employe.findOne({
        where: { id_utilisateur: userId },
      });

      if (!employe || employe.id_employe !== parseInt(id_employe, 10)) {
        return res.status(403).json({ error: 'Permission denied.' });
      }

      const reclamations = await Reclamation.findAll({
        where: { id_employe },
        attributes: [
          'id_reclamation',
          'contenu',
          'statut',
          'createdAt',
          'updatedAt',
          'message_admin',
        ],
      });

      res.status(200).json(reclamations);
    } catch (error) {
      console.error('Error retrieving reclamations:', error);
      res.status(500).json({
        message: 'Error retrieving reclamations',
        error: error.message,
      });
    }
  };


     
module.exports = exports;
