const { DataTypes } = require('sequelize');

module.exports = function (fastify){

    const Note = fastify.db.define('Note', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
    })

    return Note;
}