const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./OffreModel');
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
    id_offre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'offre',
            key: 'id_offre',
        },
    }
}, {
    tableName: 'mention',
    timestamps: false
});

MentionModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });
MentionModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });

module.exports = MentionModel;
