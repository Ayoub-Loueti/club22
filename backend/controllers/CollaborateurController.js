const Utilisateur = require('../models/UtilisateurModel');
const Collaborateur = require('../models/CollaborateurModel');
const nodemailer = require('nodemailer');

exports.createCollaborateur = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error:
            'Permission refusée. Seuls les administrateurs peuvent effectuer cette action.',
        });
      }
  
      const collaborateur = await Collaborateur.create(req.body);
      res.status(201).json({ collaborateur });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create collaborateur' });
    }
};
  
exports.archiveCollab = async (req, res) => {
    const { collabId } = req.params;
  
    try {
      // Check if the user making the request is an administrator
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error: 'Permission denied. Only administrators can perform this action.',
        });
      }
  
      // Find the employe by ID
      const collab = await Collaborateur.findOne({
        where: {
          id_collaborateur: collabId,
        },
      });
  
      if (!collab) {
        return res.status(404).json({ error: 'Collaborateur not found' });
      }
  
      // Update the adherant field only if it's false
      if (!collab.archiver) {
        await collab.update({ archiver: true });
        return res.status(200).json({ message: 'Collaborateur archiver avec succees' });
      } else {
        return res.status(400).json({ error: 'Collaborateur deja archivée' });
      }
    } catch (error) {
      console.error('Failed to update collaborateur archive status:', error);
      res.status(500).json({ error: 'Failed to update collaborateur archive status' });
    }
};
  
exports.desarchiveCollab = async (req, res) => {
    const { collabId } = req.params;
  
    try {
      // Check if the user making the request is an administrator
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error: 'Permission denied. Only administrators can perform this action.',
        });
      }
  
      // Find the employe by ID
      const collab = await Collaborateur.findOne({
        where: {
          id_collaborateur: collabId,
        },
      });
  
      if (!collab) {
        return res.status(404).json({ error: 'Collaborateur not found' });
      }
  
      // Update the adherant field only if it's false
      if (collab.archiver) {
        await collab.update({ archiver: false });
        return res.status(200).json({ message: 'Collaborateur desarchiver avec succees' });
      } else {
        return res.status(400).json({ error: 'Collaborateur deja desarchivée' });
      }
    } catch (error) {
      console.error('Failed to update collaborateur archive status:', error);
      res.status(500).json({ error: 'Failed to update collaborateur archive status' });
    }
};
  
  /*
  exports.deleteCollaborateur = async (req, res) => {
    const { collaboratorId } = req.params;
    console.log('ID du collaborateur à supprimer :', collaboratorId); // Log for debugging
    try {
      // Check if collaboratorId is undefined or a valid value
      if (!collaboratorId) {
        return res.status(400).json({ error: 'ID du collaborateur manquant' });
      }
  
      // Check if the user is an admin
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error:
            'Permission denied. Seuls les administrateurs peuvent effectuer cette action.',
        });
      }
  
      // Check if the collaborator exists
      const collaborateur = await Collaborateur.findByPk(collaboratorId);
      if (!collaborateur) {
        return res.status(404).json({ error: 'Collaborateur not found' });
      }
  
      // Delete associated offres first
      await OffreModel.destroy({ where: { id_collaborateur: collaboratorId } });
  
      // Then delete the collaborator
      await Collaborateur.destroy({
        where: { id_collaborateur: collaboratorId },
      });
  
      res.status(200).json({ message: 'Collaborateur deleted successfully' });
    } catch (error) {
      console.error('Failed to delete collaborateur:', error);
      res.status(500).json({ error: 'Failed to delete collaborateur' });
    }
  };
  */

exports.getAllCollaborateursAD = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
      }
  
      const collaborateur = await Collaborateur.findAll();
      res.status(200).json(collaborateur);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get Collaborateur' });
    }
};

exports.getAllCollaborateurs = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
      }
  
      const collaborateur = await Collaborateur.findAll({
        where: {
          archiver: false,
        },
      });
      res.status(200).json(collaborateur);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get Collaborateur' });
    }
};
exports.getAllCollaborateursEmploye = async (req, res) => {
  try {
    const isEmployee = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'employe',
      },
    });

    if (!isEmployee) {
      return res.status(403).json({
        error: 'Permission denied. Only employees can perform this action.',
      });
    }

    const collaborateurs = await Collaborateur.findAll({
      where: {
        archiver: false,
      },
    });
    res.status(200).json(collaborateurs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Collaborateurs' });
  }
};

  
exports.getCollaborateurById = async (req, res) => {
    const { collaboratorId } = req.params;
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
      }
  
      const collaborateur = await Collaborateur.findByPk(collaboratorId);
      if (!collaborateur) {
        return res.status(404).json({ error: 'Collaborateur not found' });
      }
      res.status(200).json(collaborateur);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get collaborateur' });
    }
};
  
exports.updateCollaborateur = async (req, res) => {
    const { collaboratorId } = req.params;
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId,
          type: 'admin',
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
      }
  
      const collaborateur = await Collaborateur.findByPk(collaboratorId);
  
      if (!collaborateur) {
        return res.status(404).json({ error: 'Collaborateur not found' });
      }
  
      await collaborateur.update(req.body);
      res.status(200).json({ message: 'Collaborateur updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update collaborateur' });
    }
};

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre service de messagerie
  auth: {
    user: process.env.MAILER_EMAIL_ID, // Utilisez la variable d'environnement pour l'email
    pass: process.env.MAILER_PASSWORD, // Utilisez la variable d'environnement pour le mot de passe
  },
});

exports.updateCollaborateurValidation = async (req, res) => {
  const { collaboratorId } = req.params;

  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error: 'Permission denied. Only administrators can perform this action.',
      });
    }

    const collaborateur = await Collaborateur.findByPk(collaboratorId);

    if (!collaborateur) {
      return res.status(404).json({ error: 'Collaborateur not found' });
    }

    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    await collaborateur.update({ validation: tomorrow });

    // Send email
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: collaborateur.email,
      subject: 'Accès pour ajouter des offres',
      html: `
      <p>Bonjour Monsieur/Madame,</p>
      <p><strong>Vous avez désormais la possibilité d'ajouter des offres directement sur notre plateforme.</strong></p>
      <p>Accédez à l'application via ce lien pour commencer à ajouter vos offres:</p>
      <a href="http://localhost:3000/Club22/${collaboratorId}" style="color: blue; font-weight: bold;">Cliquez ici</a>
      <p><strong>Veuillez noter que ce lien sera valide pour les prochaines 24 heures uniquement, jusqu'au ${tomorrow.toLocaleString()}.</strong></p>
      <p>Après ce délai, l'accès sera révoqué, et il ne sera plus possible d'ajouter des offres sans une nouvelle invitation.</p>
      <p>Nous espérons que cette collaboration sera fructueuse et bénéfique pour nos deux parties.</p>
      <p>Cordialement,</p>
      <p><strong style="color: navy;">Club22 Ooredoo</strong></p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Collaborateur validation date updated successfully and email sent.' });
  } catch (error) {
    console.error('Failed to update collaborateur validation date:', error);
    res.status(500).json({ error: 'Failed to update collaborateur validation date' });
  }
};

exports.checkValidationDate = async (req, res) => {
  try {
    const { id_collaborateur } = req.params;
    const collaborateur = await Collaborateur.findByPk(id_collaborateur);

    if (!collaborateur) {
      return res.status(404).json({ message: 'Collaborateur not found' });
    }

    const isValid = collaborateur.validation && new Date(collaborateur.validation) > new Date();

    res.status(200).json({ result: isValid ? 1 : 0 });
  } catch (error) {
    console.error('Error checking validation date:', error);
    res.status(500).json({ error: 'Failed to check validation date', details: error.message });
  }
};

module.exports = exports;
