const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UtilisateurModel = sequelize.define(
  'Utilisateur',
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING,
    },
    prenom: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    motDePasse: {
      type: DataTypes.STRING,
    },
    photo: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.ENUM('homme', 'femme', 'inconnu'),
    },
    type: {
      type: DataTypes.ENUM('client', 'employe', 'admin'),
    },
    etat: {
      type: DataTypes.ENUM('En attente', 'autorise', 'bloque'),
    },
    tel: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
    },

    resetPasswordExpires: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: 'Profil en cours de personnalisation!',
    },
    loginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lockUntil: {
      type: DataTypes.TIME,
      defaultValue: null,
    },
    nbr_notifs: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'utilisateur',
    timestamps: false,
  }
);

module.exports = UtilisateurModel;
