const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DiscussionModel = sequelize.define(
  'Discussion',
  {
    id_disc: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nomDisc: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeDisc: {
      type: DataTypes.ENUM('temporaire', 'infini'),
    },
    nbr_jours_disc: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    date_fin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ispublic: {  
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
  },
  {
    tableName: 'discussion',
    timestamps: false,
  }
);

module.exports = DiscussionModel;
