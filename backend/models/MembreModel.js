const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const DiscussionModel = require('./DiscussionModel'); 
const UtilisateurModel = require('./UtilisateurModel');

const MembreModel = sequelize.define(
  'Membre',
  {
    id_membre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_discussion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discussion', 
        key: 'id_disc', 
      }
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur', 
        key: 'id_utilisateur',
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: 'membre',
    timestamps: false
  }
);

MembreModel.belongsTo(DiscussionModel, { foreignKey: 'id_discussion', as: 'discussion' });
MembreModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = MembreModel;