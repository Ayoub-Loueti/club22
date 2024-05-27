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
    etat: {
      type: DataTypes.ENUM(
        'en_cours',
        'confirmer',
        'annuler',
        'reparation',
        'accepter',
        'refuser'
      ),
    },
    months: {
      type: DataTypes.ENUM('0','1', '2', '3', '4', '5', '6', '7', '8'),
    },
    nombre: {
      type: DataTypes.INTEGER,
    },
    prix_totale: {
      type: DataTypes.FLOAT,
    },
    typeR: {
      type: DataTypes.ENUM('voyage', 'hotel', 'activité', 'autre'),
    },
    date_debut: {
      type: DataTypes.DATE,
    },
    date_fin: {
      type: DataTypes.DATE,
    },
    mode_paiement: {
      type: DataTypes.ENUM('especes', 'deduction_salaire', 'paiement_en_ligne'),
    },
    autorisation_deduction_salaire: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    date_paiement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    montant_deduit: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    statut_paiement: {
      type: DataTypes.ENUM('en_attente', 'accepte', 'refuse', 'paye_especes', 'payé'),
      defaultValue: 'en_attente',
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
