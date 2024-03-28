const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./OffreModel');
const UtilisateurModel=require('./UtilisateurModel');

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
  },
  {
    tableName: 'reservation',
    timestamps: false,
  }
);
ReservationModel.belongsTo(OffreModel, {
  foreignKey: 'id_offre',
});
ReservationModel.belongsTo(UtilisateurModel, {
  foreignKey: 'id_utilisateur',
});


module.exports = ReservationModel;
