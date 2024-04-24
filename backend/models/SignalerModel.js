const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const PostModel = require('./PostModel');

const SignalerModel = sequelize.define(
  'Signaler',
  {
    id_signaler: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_post: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id_post',
      },
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur',
      },
    },
    id_cmntr: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
      id_reponse: {
        type: DataTypes.INTEGER,
        defaultValue: false,
      },
    isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    isOpen: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
  },
  {
    tableName: 'signaler',
    timestamps: false,
  }
);

SignalerModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
SignalerModel.belongsTo(UtilisateurModel, {foreignKey: 'id_utilisateur',as: 'utilisateur',});

module.exports = SignalerModel;
