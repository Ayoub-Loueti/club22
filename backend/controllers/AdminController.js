const Utilisateur = require('../models/UtilisateurModel'); 

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
        return res
          .status(403)
          .json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      // If the user is an administrator, proceed with updating the user's etat
      const userToUpdate = await Utilisateur.findByPk(id);
  
      if (!userToUpdate) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Toggle the etat from 'autorise' to 'bloque' or vice versa
      const newEtat = userToUpdate.etat === 'autorise' ? 'bloque' : 'autorise';
  
      const updatedUser = await Utilisateur.update({ etat: newEtat }, {
        where: { id_utilisateur: id, etat: userToUpdate.etat },
      });
  
      if (updatedUser[0] === 1) {
        res.status(200).json({ message: `User etat updated successfully to ${newEtat}` });
      } else if (updatedUser[0] === 0) {
        res.status(404).json({ error: `User not found or already in ${newEtat} state` });
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
        return res
          .status(403)
          .json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      // If the user is an administrator, proceed with updating the user's etat
      const updatedUser = await Utilisateur.update({ etat: 'autorise' }, {
        where: { id_utilisateur: id, etat: 'bloque' },
      });
  
      if (updatedUser[0] === 1) {
        res.status(200).json({ message: 'User etat updated successfully to autorise' });
      } else if (updatedUser[0] === 0) {
        res.status(404).json({ error: 'User not found or already in authorized state' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

exports.getAllAuthorizedUsers = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId, 
          type: 'admin', 
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      const authorizedUsers = await Utilisateur.findAll({
        where: {
          etat: 'autorise',
          type: 'client',
        },
      });
  
      res.status(200).json(authorizedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.getAllBlockedUsers = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId, 
          type: 'admin', 
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
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
  };

exports.getAllAuthorizedEmploye = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId, 
          type: 'admin', 
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
      }
  
      const authorizedUsers = await Utilisateur.findAll({
        where: {
          etat: 'autorise',
          type: 'employe',
        },
      });
  
      res.status(200).json(authorizedUsers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
exports.getAllBlockedEmploye = async (req, res) => {
    try {
      const isAdmin = await Utilisateur.findOne({
        where: {
          id_utilisateur: req.userId, 
          type: 'admin', 
        },
      });
  
      if (!isAdmin) {
        return res.status(403).json({ error: 'Permission denied. Only administrators can perform this action.' });
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
  };

  module.exports = exports;