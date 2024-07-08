const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PostModel = require('./PostModel');

const HachtagModel = sequelize.define(
  'Hachtag',
  {
    id_hachtag: {
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
    hachtag: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'hachtag',
    timestamps: false,
  }
);

HachtagModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });

module.exports = HachtagModel;
