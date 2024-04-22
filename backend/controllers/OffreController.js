const Utilisateur = require('../models/UtilisateurModel');
const OffreModel = require('../models/OffreModel');
const CollaborateurModel = require('../models/CollaborateurModel');
const ImageOffre = require('../models/ImageOffreModel');
const multiImageUpload = require('../middleware/multiImageUpload');


  exports.getOfferImages = async (req, res) => {
    const { offreId } = req.params;
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
              'Permission denied. Only administrators can access offer images.',
          });
      }

      const images = await ImageOffre.findAll({
        where: { id_offre: offreId },
        attributes: ['image'], // Ensure this is the correct field name in your model
      });

      if (!images.length) {
        return res
          .status(404)
          .json({ message: 'No images found for this offer' });
      }

      res.status(200).json(images.map((img) => img.image)); // Modify as necessary to match your file path handling
    } catch (error) {
      console.error('Failed to get offer images:', error);
      res.status(500).json({ error: 'Failed to retrieve offer images' });
    }
  };

// Creation of an offer
exports.createOffre = async (req, res) => {
  try {
    const isAdmin = await Utilisateur.findOne({
      where: { id_utilisateur: req.userId, type: 'admin' },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
    }

    const {
      titre,
      description,
      date_debut,
      date_fin,
      prix,
      id_collaborateur,
      type,
      remise,
    } = req.body;
    const offre = await OffreModel.create({
      titre,
      description,
      date_debut,
      date_fin,
      prix,
      id_collaborateur,
      type,
      remise,
    });

    if (req.files && req.files.length > 0) {
      const imageUploads = req.files.map(file => {
        const imagePath = file.path;  // Assumes path handling is already set
        return ImageOffre.create({ image: imagePath, id_offre: offre.id_offre });
      });
      await Promise.all(imageUploads);
    }

    res.status(201).json({ message: 'Offre created successfully', offre });
  } catch (error) {
    console.error('Error creating offre:', error);
    res.status(500).json({ error: 'Failed to create offre', details: error.message });
  }
};

// Updating an offer
exports.updateOffre = async (req, res) => {
  const { offreId } = req.params;
  try {
    const isAdmin = await Utilisateur.findOne({
      where: { id_utilisateur: req.userId, type: 'admin' },
    });

    if (!isAdmin) {
      return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
    }

    const offre = await OffreModel.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ error: 'Offre not found' });
    }

    const updateData = {
      titre: req.body.titre,
      description: req.body.description,
      prix: req.body.prix,
      date_debut: req.body.date_debut,
      date_fin: req.body.date_fin,
      id_collaborateur: req.body.id_collaborateur,
      type:req.body.type,
      remise:req.body.remise
    };

    await offre.update(updateData);

    if (req.files && req.files.length > 0) {
      const existingImages = await ImageOffre.findAll({ where: { id_offre: offreId } });
      const deletions = existingImages.map(img => img.destroy());
      await Promise.all(deletions);

      const imageUploads = req.files.map(file => {
        const imagePath = file.path;  // Assumes path handling is already set
        return ImageOffre.create({ image: imagePath, id_offre: offre.id_offre });
      });
      await Promise.all(imageUploads);
    }

    res.status(200).json({ message: 'Offre updated successfully', data: offre });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Failed to update offre', details: error.message });
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

exports.getAllEmployeeOffers = async (req, res) => {
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

    const offres = await OffreModel.findAll({
      include: {
        model: CollaborateurModel,
        as: 'collaborateur',
        attributes: ['nom', 'logo'],
      },
      attributes: { exclude: ['created_at', 'updated_at'] },
    });

    if (!offres.length) {
      return res.status(404).json({ message: 'No offers found' });
    }

    const offreDetails = await Promise.all(
      offres.map(async (offre) => {
        const offreJson = offre.toJSON();

        const images = await ImageOffre.findAll({
          where: {
            id_offre: offre.id_offre,
          },
        });
        offreJson.lesImages = images;
        return offreJson;
      })
    );
    res.status(200).json(offreDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offers' });
  }
};

exports.getEmployeeOfferById = async (req, res) => {
  const { offreId } = req.params;
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

    const offre = await OffreModel.findByPk(offreId);
    if (!offre) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    const images = await ImageOffre.findAll({
      where: {
        id_offre: offre.id_offre,
      },
    });
    const offreDetail = offre.toJSON();
    offreDetail.lesImages = images;
    res.status(200).json(offreDetail);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offer' });
  }
};

exports.getAllOffresCollab = async (req, res) => {
  try {
    const { collabId } = req.params; 

    const offres = await OffreModel.findAll({
      include: {
        model: CollaborateurModel,
        as: 'collaborateur',
        where: { id_collaborateur: collabId }, // Filter by collaborator ID
        attributes: ['nom', 'logo'],
      },
      attributes: { exclude: ['created_at', 'updated_at'] }, // Exclude timestamps from OffreModel
    });

    if (!offres.length) {
      return res.status(204).json({ message: 'No offres found for the collaborator' });
    }

    const offreDetails = await Promise.all(
      offres.map(async(offre) => {
        const offreJson = offre.toJSON();

        const images = await ImageOffre.findAll({
          where: {
            id_offre:offre.id_offre,
          },
        });
        offreJson.lesImages = images;
        return offreJson;
      })
    );
    res.status(200).json(offreDetails);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get offres' });
  }
};

module.exports = exports;
