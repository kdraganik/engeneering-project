const { DataTypes } = require('sequelize');

module.exports = function (fastify){

    const User = fastify.db.define('User', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        hashedPassword: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('Admin', 'Leader', 'User'),
            allowNull: false,
            defaultValue: 'User'
        }
    });

    return User;
}