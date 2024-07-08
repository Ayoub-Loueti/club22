const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const EmployeModel = require('./EmployeModel');

const ReclamationModel = sequelize.define(
  'Reclamation',
  {
    id_reclamation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenu: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    id_employe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employe',
        key: 'id_employe',
      },
    },
    statut: {
      type: DataTypes.ENUM('En attente', 'Traitée', 'Rejetée'),
      defaultValue: 'En attente',
      allowNull: false,
    },
    message_admin: {
      type: DataTypes.TEXT,
      allowNull: true, 
    },
  },
  {
    tableName: 'reclamation',

    timestamps: true,
  }
);

// Définir la relation
ReclamationModel.belongsTo(EmployeModel, {
  foreignKey: 'id_employe',
  as: 'employe',
});

module.exports = ReclamationModel;
