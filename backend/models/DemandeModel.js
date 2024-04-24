const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const EmployeModel = require('./EmployeModel');

const DemandeModel = sequelize.define(
  'Demande',
  {
    id_demande: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_employe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employe',
        key: 'id_employe',
      },
    },
    titre: {
      type: DataTypes.STRING(200),
    },
    description: {
      type: DataTypes.STRING(200),
    },
    date_demande: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    signature: {
      type: DataTypes.TEXT, // or DataTypes.BLOB for binary data
      allowNull: true,
    },
  },
  {
    tableName: 'demande',
    timestamps: false,
  }
);

DemandeModel.belongsTo(EmployeModel, { foreignKey: 'id_employe', as: 'employe' });

module.exports = DemandeModel;
