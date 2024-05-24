const Utilisateur = require('../models/UtilisateurModel');
const Employe = require('../models/EmployeModel');
const Demande = require('../models/DemandeModel');
const Commentaire = require('../models/CommentairesModel');
const Reponse = require('../models/ReponseModel');
const Post = require('../models/PostModel'); 
const NotificationSprintTroix = require('../models/NotifcationTModel');
const ReclamationModel = require('../models/ReclamationModel');

exports.getAllUsers = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est un administrateur
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

    const utilisateurs = await Utilisateur.findAll();
    res.status(200).json(utilisateurs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserEtat = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId; // Change this based on how you store user IDs

  try {
    // Check if the user making the request is an administrator
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Autorisation refusée. Seuls les administrateurs peuvent effectuer cette action.',
      });
    }

    // If the user is an administrator, proceed with updating the user's etat
    const userToUpdate = await Utilisateur.findByPk(id);

    if (!userToUpdate) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Toggle the etat from 'autorise' to 'bloque' or vice versa
    const newEtat = userToUpdate.etat === 'autorise' ? 'bloque' : 'autorise';

    const updatedUser = await Utilisateur.update(
      { etat: newEtat },
      {
        where: { id_utilisateur: id, etat: userToUpdate.etat },
      }
    );

    if (updatedUser[0] === 1) {
      res
        .status(200)
        .json({ message: `User etat updated successfully to ${newEtat}` });
    } else if (updatedUser[0] === 0) {
      res
        .status(404)
        .json({ error: `User not found or already in ${newEtat} state` });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUserEtatAutorise = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId; // Change this based on how you store user IDs

  try {
    // Check if the user making the request is an administrator
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        error:
          'Permission denied. Only administrators can perform this action.',
      });
    }

    // If the user is an administrator, proceed with updating the user's etat
    const updatedUser = await Utilisateur.update(
      { etat: 'autorise', loginAttempts: 0 },
      {
        where: { id_utilisateur: id, etat: 'bloque' },
      }
    );

    if (updatedUser[0] === 1) {
      res
        .status(200)
        .json({ message: 'User etat updated successfully to autorise' });
    } else if (updatedUser[0] === 0) {
      res
        .status(404)
        .json({ error: 'User not found or already in authorized state' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllClients = async (req, res) => {
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

    const authorizedUsers = await Utilisateur.findAll({
      where: {
        type: 'client',
      },
    });

    res.status(200).json(authorizedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* exports.getAllBlockedUsers = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res
        .status(403)
        .json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
    }

    const blockedUsers = await Utilisateur.findAll({
      where: {
        etat: 'bloque',
        type: 'client',
      },
    });

    res.status(200).json(blockedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */

exports.getAllEmploye = async (req, res) => {
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
          'Autorisation refusée. Seuls les administrateurs peuvent effectuer cette action.',
      });
    }

    const authorizedUsers = await Utilisateur.findAll({
      where: {
        type: 'employe',
      },
    });

    res.status(200).json(authorizedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* exports.getAllBlockedEmploye = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res
        .status(403)
        .json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
    }

    const blockedUsers = await Utilisateur.findAll({
      where: {
        etat: 'bloque',
        type: 'employe',
      },
    });

    res.status(200).json(blockedUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; */


exports.updateEmployeAdherant = async (req, res) => {
  const { employeId } = req.params;

  console.log(`Attempting to update employe with ID: ${employeId}`);

  try {
    const employe = await Employe.findByPk(employeId);
    console.log('Employe details:', employe);

    if (!employe) {
      console.error(`No employe found with ID: ${employeId}`);
      return res.status(404).json({ error: 'Employe not found' });
    }

    if (!employe.adherant) {
      employe.adherant = true;
      await employe.save();
      console.log(`Employe adherant status updated to: ${employe.adherant}`);
      return res
        .status(200)
        .json({ message: 'Employe adherant status updated successfully' });
    } else {
      console.log('Employe is already an adherant.');
      return res.status(400).json({ error: 'Employe is already an adherant' });
    }
  } catch (error) {
    console.error('Error updating employe adherant status:', error);
    return res
      .status(500)
      .json({ error: 'Failed to update employe adherant status' });
  }
};

exports.updateEmployeNonAdherant = async (req, res) => {
  const { employeId } = req.params;

  try {
    const isAdmin = await Utilisateur.findOne({
      where: { id_utilisateur: req.userId, type: 'admin' },
    });
    if (!isAdmin) {
      return res
        .status(403)
        .json({
          error:
            'Permission denied. Only administrators can perform this action.',
        });
    }

    const employe = await Employe.findByPk(employeId);
    if (!employe) {
      return res.status(404).json({ error: 'Employe not found' });
    }

    if (employe.adherant) {
      await employe.update({ adherant: false });
      return res
        .status(200)
        .json({ message: 'Employe non-adherant status updated successfully' });
    } else {
      return res
        .status(400)
        .json({ error: 'Employe is already a non-adherant' });
    }
  } catch (error) {
    console.error('Failed to update employe non-adherant status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getAllDemandes = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId,
        type: 'admin',
      },
    });
    if (!isAdmin) {
      return res.status(403).json({
        error: 'Permission denied. Only administrators can view demandes.',
      });
    }
    const demandes = await Demande.findAll({
      include: [
        {
          model: Employe,
          as: 'employe',
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur', // This must be correctly defined in your model relationships
            },
          ],
        },
      ],
    });
    res.status(200).json(demandes);
  } catch (error) {
    console.error('Error fetching demandes:', error);
    res.status(500).json({ error: 'Failed to get demandes' });
  }
};

exports.deletePostAdmin = async (req, res) => {
  const { id } = req.params; // Post ID from URL parameters

  const isAdmin = await Utilisateur.findOne({
    where: {
      id_utilisateur: req.userId,
      type: 'admin',
    },
  });

  if (!isAdmin) {
      return res.status(403).json({ message: "Seuls les administrateurs peuvent supprimer des publications." });
  }

  try {
      // Fetch the id_utilisateur of the post with the given id
      const post = await Post.findOne({
        where: { id_post: id },
        attributes: ['id_utilisateur'],
      });

      if (!post) {
          return res.status(404).json({ message: "Publication introuvable." });
      }

      // Create a new NotificationSprintTroix entry with the id_utilisateur
      await NotificationSprintTroix.create({
        id_utilisateur: post.id_utilisateur,
        contenu: "Votre publication a été supprimée par un administrateur.",
        type: "signal",
        date_notif: new Date(),
      });
      const Owner = await Utilisateur.findByPk( post.id_utilisateur);
      if (Owner) {
        await Owner.increment('nbr_notifs', { by: 1 });
      }
      // Delete the post
      const deleted = await Post.destroy({ where: { id_post: id } });
      if (deleted) {
          return res.status(200).json({ message: "Publication supprimée avec succès." });
      }
      return res.status(404).json({ message: "Publication introuvable." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.deleteCommentAdmin = async (req, res) => {
  const { id } = req.params; // Comment ID from URL parameters

  const isAdmin = await Utilisateur.findOne({
    where: {
      id_utilisateur: req.userId,
      type: 'admin',
    },
  });

  if (!isAdmin) {
      return res.status(403).json({ message: "Only administrators can delete comments." });
  }

  try {
    const comment = await Commentaire.findOne({
      where: { id_cmntr: id },
      attributes: ['id_utilisateur'],
    });

    if (!comment) {
        return res.status(404).json({ message: "comment introuvable." });
    }

    // Create a new NotificationSprintTroix entry with the id_utilisateur
    await NotificationSprintTroix.create({
      id_utilisateur: comment.id_utilisateur,
      contenu: "Votre commentaire a été supprimée par un administrateur.",
      type: "signal",
      date_notif: new Date(),
    });
    const Owner = await Utilisateur.findByPk( comment.id_utilisateur);
    if (Owner) {
      await Owner.increment('nbr_notifs', { by: 1 });
    }
      const deleted = await Commentaire.destroy({ where: { id_cmntr: id } });
      if (deleted) {
          return res.status(200).json({ message: "Comment deleted successfully." });
      }
      return res.status(404).json({ message: "Comment not found." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.deleteResponseAdmin = async (req, res) => {
  const { id } = req.params; // Response ID from URL parameters

  const isAdmin = await Utilisateur.findOne({
    where: {
      id_utilisateur: req.userId,
      type: 'admin',
    },
  });

  if (!isAdmin) {
      return res.status(403).json({ message: "Only administrators can delete responses." });
  }

  try {
    const reponse = await Reponse.findOne({
      where: { id_reponse: id },
      attributes: ['id_utilisateur'],
    });

    if (!reponse) {
        return res.status(404).json({ message: "reponse introuvable." });
    }

    // Create a new NotificationSprintTroix entry with the id_utilisateur
    await NotificationSprintTroix.create({
      id_utilisateur: reponse.id_utilisateur,
      contenu: "Votre reponse a été supprimée par un administrateur.",
      type: "signal",
      date_notif: new Date(),
    });
    const Owner = await Utilisateur.findByPk( reponse.id_utilisateur);
    if (Owner) {
      await Owner.increment('nbr_notifs', { by: 1 });
    }
      const deleted = await Reponse.destroy({ where: { id_reponse: id } });
      if (deleted) {
          return res.status(200).json({ message: "Response deleted successfully." });
      }
      return res.status(404).json({ message: "Response not found." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

exports.blockUserFromReporting = async (req, res) => {
  const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis les paramètres de l'URL
  const { days } = req.body; // Récupérer le nombre de jours depuis le corps de la requête

  try {
    // Vérifier si l'utilisateur qui fait la requête est un administrateur
    const isAdmin = await Utilisateur.findOne({
      where: {
        id_utilisateur: req.userId, // Utiliser req.userId pour obtenir l'ID de l'utilisateur connecté
        type: 'admin',
      },
    });

    if (!isAdmin) {
      return res.status(403).json({
        message:
          'Accès refusé. Seuls les administrateurs peuvent effectuer cette action.',
      });
    }

    // Calculer la date jusqu'à laquelle l'utilisateur est bloqué
    const blockUntilDate = new Date();
    blockUntilDate.setDate(blockUntilDate.getDate() + parseInt(days));

    // Mettre à jour l'utilisateur pour bloquer ses capacités de signalement
    const updated = await Utilisateur.update(
      { blockSignalUntil: blockUntilDate },
      { where: { id_utilisateur: userId } }
    );

    if (updated[0] > 0) {
      res.status(200).json({
        message: `L'utilisateur ${userId} est bloqué de faire des signalements pour ${days} jours.`,
      });
    } else {
      res.status(404).json({
        message: 'Utilisateur non trouvé ou déjà mis à jour.',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReclamations = async (req, res) => {
  try {
    const reclamations = await ReclamationModel.findAll({
      include: [
        {
          model: Employe,
          as: 'employe',
          include: [
            {
              model: Utilisateur,
              as: 'utilisateur',
              attributes: ['nom', 'prenom', 'email'],
            },
          ],
        },
      ],
      attributes: [
        'id_reclamation',
        'contenu',
        'statut',
        'createdAt',
        'updatedAt',
      ],
    });
    res.status(200).json(reclamations);
  } catch (error) {
    console.error('Error fetching reclamations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.updateReclamationStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  try {
    const reclamation = await ReclamationModel.findByPk(id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    reclamation.statut = newStatus;
    await reclamation.save();

    res
      .status(200)
      .json({ message: 'Statut de la réclamation mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateReclamationMessage = async (req, res) => {
  const { id } = req.params;
  const { message_admin } = req.body;

  try {
    const reclamation = await ReclamationModel.findByPk(id);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    reclamation.message_admin = message_admin;
    await reclamation.save();

    res.status(200).json({ message: 'Message mis à jour avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = exports;
