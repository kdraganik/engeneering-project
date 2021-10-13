// Require the framework and instantiate it
const fastify = require('fastify')({
  logger: true
});

const dotenv = require('dotenv');
dotenv.config();
const dbName = process.env.DBNAME;
const dbUser = process.env.DBUSER;
const dbPassword = process.env.DBPASSWORD;
const dbHost = process.env.DBHOST;
const dbPort = process.env.DBPORT;

fastify.register(require("fastify-cors"), {
  origin: "*"
});

fastify.register(require('sequelize-fastify'), {
  instance: 'db',
  sequelizeOptions: {
      dialect: 'mysql',
      database: dbName,
      username: dbUser,
      password: dbPassword,
      host: dbHost,
      port: dbPort
  }
}).ready(async () => {
  try {
      await fastify.db.authenticate();  
      console.log('Database connection is successfully established.');
  } catch(err) {
      console.log(`Connection could not be established: ${err}`)
  }
})

fastify.register(require('./models'));

fastify.register(require('fastify-jwt'), { secret: process.env.JWT_SECRET });

fastify.register(require('fastify-swagger'), {
  exposeRoute: true,
  routePrefix: '/docs',
  swagger: {
    info: { title: 'event-managment-api' },
  },
})

fastify.register(require('./routes/users'));
fastify.register(require('./routes/teams'));
fastify.register(require('./routes/events'));
fastify.register(require('./routes/tasks'));
fastify.register(require('./routes/comments'));
fastify.register(require('./routes/notes'));

// Run the server!
const PORT = process.env.PORT || 8080;
fastify.listen(PORT, function (err, address) { //, "0.0.0.0"
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`);
})