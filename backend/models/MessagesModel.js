const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel =require('./UtilisateurModel');
const DiscussionModel = require('./DiscussionModel');

const MessageModel = sequelize.define(
  'Messages',
  {
    id_msg: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'utilisateur',
        key: 'id_utilisateur',
      },
    },
    contenu: {
      type: DataTypes.STRING,
    },
    id_disc: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'discussion',
        key: 'id_disc',
      },
    },
  },

  {
    tableName: 'messages',
    timestamps: false,
  }
);

MessageModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur',as: 'utilisateur'});
MessageModel.belongsTo(DiscussionModel, { foreignKey: 'id_disc',as: 'discussion'});

module.exports = MessageModel;
