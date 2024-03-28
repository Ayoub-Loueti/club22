const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CollaborateurModel = require('./CollaborateurModel');

const OffreModel = sequelize.define(
  'Offre',
  {
    id_offre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_debut: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    date_fin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: 'offre',
    timestamps: false,
  }
);
OffreModel.belongsTo(CollaborateurModel, {
  foreignKey: 'id_collaborateur',
});
module.exports = OffreModel;
