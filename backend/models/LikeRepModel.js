const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const ReponseModel = require('./ReponseModel');

const LikeRepModel = sequelize.define('LikeRep', {
    id_likeRep: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_reponse: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'reponse',
            key: 'id_reponse',
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
    date_likeRep: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'likerep',
    timestamps: false
});

LikeRepModel.belongsTo(ReponseModel, { foreignKey: 'id_reponse', as: 'reponse' });
LikeRepModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = LikeRepModel;
