const bcrypt = require('bcrypt');

module.exports = function (fastify){
  const login = async (request, reply) => {
    const { email, password } = request.body;

    const user = await fastify.db.models.User.findOne({
        where:{
            email
        }
    });

    if(!user || !bcrypt.compareSync(password, user.hashedPassword)){
        reply.status(403).send({
            "statusCode": 403,
            "error": "Forbiden",
            "message": "Wrong email or password"
        });
        return;
    }

    const {id, role} = user;
    const token = fastify.jwt.sign({id, email, role}, {expiresIn: "1200s"});
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 20);
    reply.send({
      token,
      expiryDate,
      id,
      role
    });
  };

  const getUser = async (request, reply) => {
    const { id } = request.params;
    const user = await fastify.db.models.User.findOne({
        attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email', 'role'],
        where: {
            id
        },
        include: [
          {
            model: fastify.db.models.Team,
            attributes: ['id', 'name']
          }
        ]
    });

    if(user){
      const teamIds = user.Teams.map(team => team.id);

      const userEvents = await fastify.db.models.Event.findAll({
        attributes: ['id', 'name', 'place', 'date'],
        include: [
          {
            model: fastify.db.models.Team,
            attributes: ['id', 'name'],
            where: {
              id: teamIds
            },
          },
          {
            model: fastify.db.models.Task,
            attributes: ['id', 'name', 'status', 'priority', 'date'],
            include: [
              {
                model: fastify.db.models.User,
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          }
        ]
      })

      user.dataValues.Events = userEvents

      reply.send(user);
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No user with given id"
      })
    }
  };

  const getUsers = async (request, reply) => {
    const users = await fastify.db.models.User.findAll({
      attributes: ['id', 'firstName', 'lastName', 'phoneNumber', 'email', 'role'],
      include: [
        {
          model: fastify.db.models.Team,
          attributes: ['id', 'name']
        }
      ]
    });

    const getData = async () => {
      return Promise.all(users.map( async user => {
      const teamIds = user.Teams.map(team => team.id);

      const userEvents = await fastify.db.models.Event.findAll({
        attributes: ['id', 'name', 'place', 'date'],
        include: [
          {
            model: fastify.db.models.Team,
            attributes: ['id', 'name'],
            where: {
              id: teamIds
            },
          },
          {
            model: fastify.db.models.Task,
            attributes: ['id', 'name', 'status', 'priority', 'date'],
            include: [
              {
                model: fastify.db.models.User,
                attributes: ['id', 'firstName', 'lastName']
              }
            ]
          }
        ]
      })

      return({
        ...user.dataValues,
        Events: userEvents
      });
    }))}

    const usersWithEvents = await getData();
    
    reply.send(usersWithEvents);
  };

  const createUser = async (request, reply) => {
    let { firstName, lastName, email, phoneNumber, password, role } = request.body;
    role = role || 'User';
    
    const emailUser = await fastify.db.models.User.findOne({
      where:{
          email
      }
    });
    
    if(!emailUser){
      const phoneNumberUser = await fastify.db.models.User.findOne({
        where:{
            phoneNumber
        }
      });

      if(!phoneNumberUser){
        const hashedPassword = bcrypt.hashSync(password, 12);

        const newUser = await fastify.db.models.User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            hashedPassword,
            role
        })

        reply.status(201).send(newUser);
      }
      else{
        reply.status(409).send({
            "statusCode": 409,
            "error": "Conflict",
            "message": "Given phone number is already in use"
        })
      }
    }
    else{
      reply.status(409).send({
        "statusCode": 409,
        "error": "Conflict",
        "message": "Given email is already in use"
      })
    }
  };

  const editUser = async (request, reply) => {
    const {id} = request.params;
    const user = await fastify.db.models.User.findOne({
        where: {
          id
        }
    });

    if(user){
      let {firstName, lastName, phoneNumber, email, password, role} = request.body;

      const emailUser = await fastify.db.models.User.findOne({
        where:{
          email
        }
      })

      if(!emailUser || emailUser.id == user.id){
        const phoneNumberUser = await fastify.db.models.User.findOne({
          where:{
            phoneNumber
          }
        });
      
        if(!phoneNumberUser || phoneNumberUser.id == user.id){
          user.firstName = firstName || user.firstName;
          user.lastName = lastName || user.lastName;
          user.phoneNumber = phoneNumber || user.phoneNumber;
          user.email = email || user.email;
          if(password){
              user.hashedPassword = bcrypt.hashSync(password, 12);
          }
          user.role = role ||user.role
          await user.save();

          reply.send(user);
        }
        else{
          reply.status(409).send({
            "statusCode": 409,
            "error": "Conflict",
            "message": "Given phone number is already in use"
          })
        }
      }
      else{
        reply.status(409).send({
          "statusCode": 409,
          "error": "Conflict",
          "message": "Given email is already in use"
        })
      }
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No user with given id"
      })
    }
  };

  const deleteUser = async (request, reply) => {
    const {id} = request.params;
    const user = await fastify.db.models.User.findOne({
        where: {
            id
        }
    });

    if(user){
      await user.destroy();

      reply.send({
          statusCode: 200,
          message: `User (id: ${id}) successfully deleted`
      })
    }
    else{
      reply.status(404).send({
        "statusCode": 404,
        "error": "Not found",
        "message": "No User with given id" 
      })
    }
  };

  return {
    login,
    getUser,
    getUsers,
    createUser,
    editUser,
    deleteUser
  }
}