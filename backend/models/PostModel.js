const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const UtilisateurModel = require('./UtilisateurModel');

const PostModel = sequelize.define(
  'Post',
  {
    id_post: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contenu: {
      type: DataTypes.STRING,
    },
    date_post: {
      type: DataTypes.DATE,
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
    nbr_likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    type: {
      type: DataTypes.ENUM('hotel', 'voyage', 'activité', 'autre'),
    },
    lieu: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
  },
  {
    tableName: 'post',
    timestamps: false,
  }
);

PostModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' }); 


module.exports = PostModel;
