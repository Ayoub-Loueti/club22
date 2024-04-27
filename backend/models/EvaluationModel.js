const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const EmployeModel = require('./EmployeModel');
const OffreModel = require('./OffreModel');

const EvaluationModel = sequelize.define(
  'Evaluation',
  {
    id_evaluation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_offre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'offre',
        key: 'id_offre',
      },
    },
    id_employe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employe',
        key: 'id_employe',
      },
    },
    vote: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'evaluation',
    timestamps: false,
  }
);

EvaluationModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });
EvaluationModel.belongsTo(EmployeModel, { foreignKey: 'id_employe', as: 'employe',});

module.exports = EvaluationModel;
