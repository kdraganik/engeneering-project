const { DataTypes } = require('sequelize');

module.exports = function (fastify){

    const Team = fastify.db.define('Team', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    return Team;
}