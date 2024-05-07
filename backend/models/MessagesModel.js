const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const EmployeModel =require('./EmployeModel');

const MessageModel = sequelize.define(
  'Messages',
  {
    id_msg: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_employe: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employe',
        key: 'id_employe',
      },
    },
    contenu: {
      type: DataTypes.STRING,
    },
  },

  {
    tableName: 'messages',
    timestamps: false,
  }
);

MessageModel.belongsTo(EmployeModel, { foreignKey: 'id_employe',as: 'employe'});


module.exports = MessageModel;
