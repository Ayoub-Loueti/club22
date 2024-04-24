const Utilisateur = require('../models/UtilisateurModel');
const Employe = require('../models/EmployeModel');
const Demande = require('../models/DemandeModel');
const Commentaire = require('../models/CommentairesModel');
const Reponse = require('../models/ReponseModel');
const Post = require('../models/PostModel'); 

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
          'Permission denied. Only administrators can perform this action.',
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
          'Permission denied. Only administrators can perform this action.',
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
      return res.status(403).json({ message: "Only administrators can delete posts." });
  }

  try {
      const deleted = await Post.destroy({ where: { id_post: id } });
      if (deleted) {
          return res.status(200).json({ message: "Post deleted successfully." });
      }
      return res.status(404).json({ message: "Post not found." });
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
      const deleted = await Reponse.destroy({ where: { id_reponse: id } });
      if (deleted) {
          return res.status(200).json({ message: "Response deleted successfully." });
      }
      return res.status(404).json({ message: "Response not found." });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

module.exports = exports;
