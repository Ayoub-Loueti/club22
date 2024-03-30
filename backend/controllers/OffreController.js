const Utilisateur = require('../models/UtilisateurModel');
const OffreModel = require('../models/OffreModel');

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
