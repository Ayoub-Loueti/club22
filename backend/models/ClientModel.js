const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

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

module.exports = ClientModel;
