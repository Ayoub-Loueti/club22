const Utilisateur = require('../models/UtilisateurModel');
const OffreModel = require('../models/OffreModel');
const CollaborateurModel = require('../models/CollaborateurModel');
const ImageOffre = require('../models/ImageOffreModel');
const multiImageUpload = require('../middleware/multiImageUpload');

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
        error: 'Permission denied. Only administrators can perform this action.',
      });
    }

    multiImageUpload(req, res, async (error) => {
      if (error) {
        return res.status(500).json({ message: error.message });
      } 
      
      try {
        const { titre, description, date_debut, date_fin, prix, id_collaborateur } = req.body;

        const offre = await OffreModel.create({
          titre,
          description,
          date_debut,
          date_fin,
          prix,
          id_collaborateur,
        });

        if (req.files && req.files.length > 0) {
          await Promise.all(req.files.map(file => {
            const image = file.path; // Path where the file is saved
            return ImageOffre.create({
              image,
              id_offre: offre.id_offre,
            });
          }));
        }

        res.status(201).json({ offre });
      } catch (error) {
        console.error('Error creating offre:', error);
        res.status(500).json({ error: 'Failed to create offre' });
      }
    });
  } catch (error) {
    console.error('Error checking admin status:', error);
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

    const offres = await OffreModel.findAll({
      include: {
        model: CollaborateurModel,
        as: 'collaborateur',
        attributes: ['nom', 'logo'],
      },
      attributes: { exclude: ['created_at', 'updated_at'] }, // Exclude timestamps from OffreModel
    });

    if (!offres.length) {
      return res.status(404).json({ message: 'No offres found' });
    }

    const offreDetails = await Promise.all(
      offres.map(async(offre) => {
        const offreJson = offre.toJSON();

        const images = await ImageOffre.findAll({
          where: {
            id_offre:offre.id_offre,
          },
        });
        offreJson.lesImages=images;
        return offreJson;
      })
    );
    res.status(200).json(offreDetails);
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
    const images = await ImageOffre.findAll({
      where:{
        id_offre: offre.id_offre,
      },
    })
    const offreDetail = offre.toJSON();
    offreDetail.lesImages=images;
    res.status(200).json(offreDetail);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offre' });
  }
};

module.exports = exports;
