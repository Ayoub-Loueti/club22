const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./OffreModel');

const ActiviteModel = sequelize.define(
  'Activite',
  {
    id_activite: {
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
    duree: { type: DataTypes.INTEGER },
  },
  {
    timestamps: false,
    tableName: 'activite',
  }
);
ActiviteModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });

module.exports = ActiviteModel;
