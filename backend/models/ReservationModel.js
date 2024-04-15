const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./OffreModel');
const EmployeModel =require('./EmployeModel');

const ReservationModel = sequelize.define(
  'Reservation',
  {
    id_reservation: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    date_reservation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    id_offre:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'offre',
          key: 'id_offre',
      },
    },
    id_employe:{
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'employe',
          key: 'id_employe',
      },
    },
    etat: {
      type: DataTypes.ENUM('en_cours', 'confirmer', 'annuler'),
    },
    nombre: {
      type: DataTypes.INTEGER,
    },
    prix_totale: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: 'reservation',
    timestamps: false,
  }
);

ReservationModel.belongsTo(OffreModel, { foreignKey: 'id_offre',as: 'offre'});
ReservationModel.belongsTo(EmployeModel, { foreignKey: 'id_employe',as: 'employe'});


module.exports = ReservationModel;
