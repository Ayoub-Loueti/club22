const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const CommentairesModel = require('./CommentairesModel');

const LikeComModel = sequelize.define('LikeCom', {
    id_likeCom: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_cmntr: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'commentaires',
            key: 'id_cmntr',
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
    date_likeCom: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'likecom',
    timestamps: false
});

LikeComModel.belongsTo(CommentairesModel, { foreignKey: 'id_cmntr', as: 'commentaires' });
LikeComModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = LikeComModel;
