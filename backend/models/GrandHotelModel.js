const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./OffreModel');

const GrandHotelModel = sequelize.define(
  'GrandHotel',
  {
    id_grandhotel: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_offre: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'offre',
        key: 'id_offre',
      },
    },
    nom_hotel: { type: DataTypes.STRING, allowNull: false },
    etoiles: { type: DataTypes.INTEGER, allowNull: false },
    climatisation: { type: DataTypes.BOOLEAN, allowNull: false },
    wifi: { type: DataTypes.BOOLEAN, allowNull: false },
    piscine_exterieure: { type: DataTypes.BOOLEAN, allowNull: false },
    piscine_couverte: { type: DataTypes.BOOLEAN, allowNull: false },
    bassin_enfants: { type: DataTypes.BOOLEAN, allowNull: false },
    parking: { type: DataTypes.BOOLEAN, allowNull: false },
    discotheque: { type: DataTypes.BOOLEAN, allowNull: false },
    plage_privee: { type: DataTypes.BOOLEAN, allowNull: false },
    ascenseur: { type: DataTypes.BOOLEAN, allowNull: false },
    salle_de_sport: { type: DataTypes.BOOLEAN, allowNull: false },
    aire_de_jeux_enfants: { type: DataTypes.BOOLEAN, allowNull: false },
  },
  {
    tableName: 'grandhotel',
    timestamps: false,
  }
);

GrandHotelModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });

module.exports = GrandHotelModel;
