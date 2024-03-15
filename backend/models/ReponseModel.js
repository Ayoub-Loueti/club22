const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const UtilisateurModel = require('./UtilisateurModel');
const CommentairesModel = require('./CommentairesModel');

const ReponseModel = sequelize.define(
  'Reponse', 
  {
    id_reponse: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contenu: {
      type: DataTypes.STRING,
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
        allowNull: false,
        references: {
          model: 'commentaire', 
          key: 'id_cmntr', 
        },
      }
  },
  {
    tableName: 'reponse',
    timestamps: false 
  }
);

ReponseModel.belongsTo(CommentairesModel, {foreignKey:'id_cmntr', as: 'commentaire' });
ReponseModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' }); 


module.exports = ReponseModel;
