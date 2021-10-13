const { DataTypes } = require('sequelize');

module.exports = function (fastify){

    const Comment = fastify.db.define('Comment', {
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false
    
        },
    })

    return Comment;
}