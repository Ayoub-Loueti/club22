const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CollaborateurModel = require('./CollaborateurModel');

const OffreModel = sequelize.define(
  'Offre',
  {
    id_offre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    date_debut: {
      type: DataTypes.DATE,
    },
    date_fin: {
      type: DataTypes.DATE,
    },
    prix: {
      type: DataTypes.FLOAT,
    },
    id_collaborateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'collaborateur',
        key: 'id_collaborateur',
      },
    },
    remise: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.ENUM('voyage', 'hotel', 'activité', 'autre'),
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING,
    },
    nombre_enfants_gratuits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    age_limite_gratuite: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    prix_enfants_payants: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    conditions_speciales_enfants: {
      type: DataTypes.STRING,
    },
    enfants_autorises: { type: DataTypes.BOOLEAN },
  },
  {
    tableName: 'offre',
    timestamps: false,
  }
);
OffreModel.belongsTo(CollaborateurModel, {foreignKey: 'id_collaborateur',as: 'collaborateur'});

module.exports = OffreModel;
