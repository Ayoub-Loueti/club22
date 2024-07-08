const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const GrandHotelModel = require('./GrandHotelModel');

const TypeChambreModel = sequelize.define(
  'TypeChambre',
  {
    id_TypeChambre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_grandhotel: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'grandHotel',
        key: 'id_grandHotel',
      },
    },
    nom: {
      type: DataTypes.ENUM(
        'Chambre standard',
        'Chambre double',
        'Chambre familiale',
        'Chambre communicante',
        'Suite',
        'Suite royale'
      ),
      allowNull: false,
    },

    supplement: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },

    defaultChambre: {
      type: DataTypes.BOOLEAN,
    },

    single: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    prixsingle: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    vuemer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    supplementmer: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    vuepis: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    supplementpis: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
  },

  {
    tableName: 'TypeChambre',
    timestamps: false,
  }
);

TypeChambreModel.belongsTo(GrandHotelModel, {
  foreignKey: 'id_grandhotel',
  as: 'grandHotel',
});


module.exports = TypeChambreModel;