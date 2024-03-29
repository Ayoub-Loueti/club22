const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CollaborateurModel = sequelize.define('Collaborateur', {
  id_collaborateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  siteWeb: {
    type: DataTypes.STRING,
  },
  logo: {
    type: DataTypes.STRING,
  },
  archiver: {
    type: DataTypes.BOOLEAN,
  }
}, {
    tableName: 'collaborateur',
    timestamps: false
});

module.exports = CollaborateurModel;
