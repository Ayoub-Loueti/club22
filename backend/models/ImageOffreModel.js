const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const OffreModel = require('./ImageModel');

const ImageOffreModel = sequelize.define('ImageOffre', {
    id_imageOffre: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    image: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    id_offre: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'offre',
          key: 'id_offre',
        },
    },
}, {
    tableName: 'imageoffre',
    timestamps: false
});

ImageOffreModel.belongsTo(OffreModel, { foreignKey: 'id_offre', as: 'offre' });

module.exports = ImageOffreModel;
