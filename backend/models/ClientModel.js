const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');

const ClientModel = sequelize.define(
  'Client',
  {
    id_client: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur', 
        key: 'id_utilisateur', 
      },
    },
    points: {
      type: DataTypes.INTEGER,
    },
    derniereAddition: {
        type: DataTypes.TIME,
        defaultValue: null,
      },
  },
  {
    tableName: 'client',
    timestamps: false,
  }
);

ClientModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = ClientModel;
