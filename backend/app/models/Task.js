const { DataTypes } = require('sequelize');

module.exports = function (fastify){

    const Task = fastify.db.define('Task', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
          type: DataTypes.STRING
        },
        status: {
            type: DataTypes.ENUM("to do", "in progress", "done"),
            allowNull: false,
            defaultValue: "to do"
        },
        date: {
            type: DataTypes.DATE,
        },
        priority: {
            type: DataTypes.ENUM("high", "normal", "low"),
        }
    });

    return Task;
}