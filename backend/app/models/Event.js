const { DataTypes } = require('sequelize');

module.exports = function (fastify){

    const Event = fastify.db.define('Event', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        place: {
            type: DataTypes.STRING,
        },
        date: {
            type: DataTypes.DATE,
        }
    });

    return Event;
}