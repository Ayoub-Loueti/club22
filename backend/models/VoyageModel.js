const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./OffreModel');

const VoyageModel = sequelize.define(
  'Voyage',
  {
    id_voyage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_offre: {
      type: DataTypes.INTEGER,
      references: {
        model: 'offre',
        key: 'id_offre',
      },
    },
    programme: { type: DataTypes.TEXT },
    inclus: { type: DataTypes.TEXT },
    nbr_jours: { type: DataTypes.INTEGER },
  },
  {
    timestamps: false,
    tableName: 'voyage',
  }
);
VoyageModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });

module.exports = VoyageModel;
