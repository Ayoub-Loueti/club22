const Utilisateur = require('../models/UtilisateurModel');
const Collaborateur = require('../models/CollaborateurModel');
const OffreModel = require('../models/OffreModel');
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

// Controller pour créer un collaborateur
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
          'Permission denied. Only administrators can perform this action.',
      });
    }

    const collaborateur = await Collaborateur.create(req.body);
    res.status(201).json({ collaborateur });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create collaborateur' });
  }
};

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

    const collaborateur = await Collaborateur.findAll();
    res.status(200).json(collaborateur);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get Collaborateur' });
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

exports.createOffre = async (req, res) => {
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

    const offre = await OffreModel.create(req.body);
    res.status(201).json({ offre });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create offre' });
  }
};

exports.updateOffre = async (req, res) => {
  const { offreId } = req.params;
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

    const offre = await OffreModel.findByPk(offreId);

    if (!offre) {
      return res.status(404).json({ error: 'Offre not found' });
    }

    await offre.update(req.body);
    res.status(200).json({ message: 'Offre updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update offre' });
  }
};

exports.deleteOffre = async (req, res) => {
  const { offreId } = req.params;
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

    // Check if the offer exists
    const offreToDelete = await OffreModel.findByPk(offreId);
    if (!offreToDelete) {
      return res.status(404).json({ error: 'Offre not found' });
    }

    // Delete the offer using the correct column name (assuming it's id_offre)
    await OffreModel.destroy({ where: { id_offre: offreId } });
    res.status(200).json({ message: 'Offre deleted successfully' });
  } catch (error) {
    console.error('Failed to delete offre:', error);
    res.status(500).json({ error: 'Failed to delete offre' });
  }
};


exports.getAllOffres = async (req, res) => {
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

    const offres = await OffreModel.findAll();
    res.status(200).json(offres);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offres' });
  }
};

exports.getOffreById = async (req, res) => {
  const { offreId } = req.params;
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

    const offre = await OffreModel.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ error: 'Offre not found' });
    }
    res.status(200).json(offre);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offre' });
  }
};

module.exports = exports;
