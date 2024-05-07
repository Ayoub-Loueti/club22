const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');

const NotificationTModel = sequelize.define(
  'notificationSprintTroix',
  {
    id_notif: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenu: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: {
        type: DataTypes.ENUM('signal','reservaccepte' ,'reservrefuse'),
        allowNull: false,
      },
  },
  {
    tableName: 'notificationSprintTroix',
    timestamps: false,
  }
);

NotificationTModel.belongsTo(UtilisateurModel, {
  foreignKey: 'id_utilisateur',
  as: 'utilisateur',
});

module.exports = NotificationTModel;
