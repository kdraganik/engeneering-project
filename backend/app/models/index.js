const bcrypt = require('bcrypt');

module.exports = async function registerModels(fastify, options, done){
    const User = require('./User')(fastify);
    const Team = require('./Team')(fastify);
    const Event = require('./Event')(fastify);
    const Note = require('./Note')(fastify);
    const Task = require('./Task')(fastify);
    const Comment = require('./Comment')(fastify);

    //Team has many users that can belong to many teams
    User.belongsToMany(Team, {through: "teamsusers"});
    Team.belongsToMany(User, {through: "teamsusers"});

    //Team has many events that can belong to many teams
    Event.belongsToMany(Team, {through: "teamsevents"});
    Team.belongsToMany(Event, {through: "teamsevents"});

    //User has many tasks that can belong to many users
    Task.belongsToMany(User, {through: "tasksusers"});
    User.belongsToMany(Task, {through: "tasksusers"});

    //Team has many tasks that can belong to that team
    Team.hasMany(Task);
    Task.belongsTo(Team);

    //Event has many notes, that belong to that event
    Event.hasMany(Note);
    Note.belongsTo(Event);

    //Event has many tasks, that belong to that event
    Event.hasMany(Task);
    Task.belongsTo(Event);

    //Task has many subtasks, that belong to that task
    Task.hasMany(Task);
    Task.belongsTo(Task);

    //Task has many comments, that belong to that task
    Task.hasMany(Comment);
    Comment.belongsTo(Task);

    //User has many comments, that belong to that user
    User.hasMany(Comment);
    Comment.belongsTo(User);

    await fastify.db.sync();

    const adminUser = await User.findOne({
        where:{
            role: 'Admin'
        }
    })
    if(!adminUser){
        const firstName = "Jan";
        const lastName = "Kowalski";
        const phoneNumber = "+48000000001";
        const email = "admin@test.com";
        const role = "Admin"
        const hashedPassword = bcrypt.hashSync('password', 12);

        await fastify.db.models.User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            hashedPassword,
            role
        })
    }

  await fastify.db.sync();

  done()
}