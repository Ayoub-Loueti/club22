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
    spa: { type: DataTypes.BOOLEAN, allowNull: false },
    sauna: { type: DataTypes.BOOLEAN, allowNull: false },
    hammam: { type: DataTypes.BOOLEAN, allowNull: false },
    thalasso: { type: DataTypes.BOOLEAN, allowNull: false },
    centre_esthetique: { type: DataTypes.BOOLEAN, allowNull: false },
    toboggan: { type: DataTypes.BOOLEAN, allowNull: false },
    pieds_dans_l_eau: { type: DataTypes.BOOLEAN, allowNull: false },
    piscine_eau_de_mer: { type: DataTypes.BOOLEAN, allowNull: false },
    baby_setting: { type: DataTypes.BOOLEAN, allowNull: false },
    tennis_de_table: { type: DataTypes.BOOLEAN, allowNull: false },
    location_de_voiture: { type: DataTypes.BOOLEAN, allowNull: false },
    change_monetaire: { type: DataTypes.BOOLEAN, allowNull: false },
    interdit_celibataires: { type: DataTypes.BOOLEAN, allowNull: false },
    interdit_burkini: { type: DataTypes.BOOLEAN, allowNull: false },
    interdit_alcohol: { type: DataTypes.BOOLEAN, allowNull: false },
    logement_seulement: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_logement_seulement: { type: DataTypes.FLOAT, defaultValue: 0 },
    petit_dejeuner: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_petit_dejeuner: { type: DataTypes.FLOAT, defaultValue: 0 },
    demi_pension: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_demi_pension: { type: DataTypes.FLOAT, defaultValue: 0 },
    demi_pension_plus: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_demi_pension_plus: { type: DataTypes.FLOAT, defaultValue: 0 },
    pension_complete: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_pension_complete: { type: DataTypes.FLOAT, defaultValue: 0 },
    pension_complete_plus: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_pension_complete_plus: { type: DataTypes.FLOAT, defaultValue: 0 },
    all_inclusive: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_all_inclusive: { type: DataTypes.FLOAT, defaultValue: 0 },
    all_inclusive_soft: { type: DataTypes.BOOLEAN, defaultValue: false },
    prix_all_inclusive_soft: { type: DataTypes.FLOAT, defaultValue: 0 },
    pensiondefault: {
      type: DataTypes.ENUM(
        'logement_seulement',
        'petit_dejeuner',
        'demi_pension',
        'demi_pension_plus',
        'pension_complete',
        'pension_complete_plus',
        'all_inclusive',
        'all_inclusive_soft'
      ),
      defaultValue: 'logement_seulement'
    },
  },
  {
    tableName: 'grandhotel',
    timestamps: false,
  }
);

GrandHotelModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });


module.exports = GrandHotelModel;
