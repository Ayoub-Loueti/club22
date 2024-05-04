const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const PostModel = require('./PostModel');

const CommentairesModel = sequelize.define('Commentaires', {
    id_cmntr: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cmntr: {
        type: DataTypes.STRING(300),
        allowNull: false
    },
    id_post: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id_post',
        },
    },
    date_cmntr: {
        type: DataTypes.DATE,
        allowNull: false
    },
    id_utilisateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'utilisateur',
            key: 'id_utilisateur',
        },
    },
    nbr_likeCom: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      semaineCom: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
}, {
    tableName: 'commentaires',
    timestamps: false
});

CommentairesModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
CommentairesModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = CommentairesModel;
