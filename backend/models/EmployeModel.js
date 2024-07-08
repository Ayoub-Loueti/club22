const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');

const EmployeModel = sequelize.define(
  'Employe',
  {
    id_employe: {
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
      adherant:{
        type: DataTypes.BOOLEAN,
      },
  },
  {
    tableName: 'employe',
    timestamps: false,
  }
);

EmployeModel.belongsTo(UtilisateurModel, {foreignKey: 'id_utilisateur',as: 'utilisateur'});

module.exports = EmployeModel;
