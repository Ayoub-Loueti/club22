const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UtilisateurModel = require('./UtilisateurModel');
const PostModel = require('./PostModel');

const EnregistrementModel = sequelize.define('Enregistrement', {
    id_save: { 
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
}, {
    tableName: 'enregistrement',
    timestamps: false
});

EnregistrementModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
EnregistrementModel.belongsTo(UtilisateurModel, { foreignKey: 'id_utilisateur', as: 'utilisateur' });

module.exports = EnregistrementModel;
