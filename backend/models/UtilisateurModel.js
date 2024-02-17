const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UtilisateurModel = sequelize.define('Utilisateur', {
    id_utilisateur: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING
    },
    prenom: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    motDePasse: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING
    },
    genre: {
        type: DataTypes.ENUM('homme', 'femme')
    },
    type: {
        type: DataTypes.ENUM('client', 'employe', 'admin')
    },
    etat:{
        type: DataTypes.ENUM('autorise','bloque')
    }
}, {
    tableName: 'utilisateur',
    timestamps: false
});

module.exports = UtilisateurModel;
