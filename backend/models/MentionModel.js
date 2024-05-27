const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CollaborateurModel = require('./CollaborateurModel');
const PostModel = require('./PostModel');

const MentionModel = sequelize.define('Mention', {
    id_mention: {
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
    id_collaborateur: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'collaborateur',
            key: 'id_collaborateur',
        },
    }
}, {
    tableName: 'mention',
    timestamps: false
});

MentionModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
MentionModel.belongsTo(CollaborateurModel, { foreignKey: 'id_collaborateur', as: 'collaborateur' });

module.exports = MentionModel;
