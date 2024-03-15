const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const PostModel = require('./PostModel');

const NotificationModel = sequelize.define(
  'Notifications',
  {
    id_notif: {
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
    type: {
      type: DataTypes.ENUM('like', 'comment', 'reponse'),
      allowNull: false,
    },
    depuis: {
      type: DataTypes.ENUM('post', 'commentaire'),
    },
    id_reponse: {
      type: DataTypes.INTEGER,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    id_own_post: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id_utilisateur',
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
    date_notif: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_cmntr: {
      type: DataTypes.INTEGER,
    },
    id_like: {
      type: DataTypes.INTEGER,
    },
    id_own_cmntr: {
      type: DataTypes.INTEGER,
    },
  },
  {
    tableName: 'notifications',
    timestamps: false,
  }
);

NotificationModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
NotificationModel.belongsTo(UtilisateurModel, {
  foreignKey: 'id_utilisateur',
  as: 'utilisateur',
});
NotificationModel.belongsTo(PostModel, { foreignKey: 'id_own_post' });

module.exports = NotificationModel;
