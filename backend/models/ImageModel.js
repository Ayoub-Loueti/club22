const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PostModel = require('./PostModel');

const ImageModel = sequelize.define('Image', {
    id_image: { 
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pathImage: {
        type: DataTypes.STRING(200),
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
}, {
    tableName: 'image',
    timestamps: false
});

ImageModel.belongsTo(PostModel, { foreignKey: 'id_post', as: 'post' });

module.exports = ImageModel;
