const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const PostModel = require('./PostModel');

const LikesModel = sequelize.define('Likes', {
    id_like: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_post: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'post',
            key: 'id_post',
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
    date_like: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'likes',
    timestamps: false
});

LikesModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
LikesModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = LikesModel;
