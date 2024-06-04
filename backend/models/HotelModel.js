//hotelmodel
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ReservationModel = require('./ReservationModel');

const HotelModel = sequelize.define('Hotel', {
    id_hotel: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    nbr_adults: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nbr_enfants: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    prix:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    id_reservation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reservation', 
            key: 'id_reservation'
        }
    },
    typechambreR: {
        type: DataTypes.ENUM(
          'Chambre standard',
          'Chambre double',
          'Chambre familiale',
          'Chambre communicante',
          'Suite',
          'Suite royale'
        ),
      },
      vue: {
        type: DataTypes.ENUM(
          'simple',
          'mer',
          'piscine',
        ),
      },
      pension: {
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
      },
}, {
    tableName: 'hotel',
    timestamps: false,
});

HotelModel.belongsTo(ReservationModel, { foreignKey: 'id_reservation', as: 'reservation' });

module.exports = HotelModel;
