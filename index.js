const fastify = require('fastify');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const connectDB = require('./config/db');
const UserCredentials = require('./models/UserCredentials');
const verifyJWT = require('./decorators/jwt');

const JWT_SECRET = config.get("JWT_SECRET");
const COOKIE_NAME = config.get("COOKIE_NAME");

// Connect to DB
connectDB();

// Configure the fastify server
const app = fastify()
app.register(require('fastify-auth'))
app.register(require('fastify-cookie'));
app.after(routes)
app.decorate("verifyJWT", verifyJWT)

// define the routes
function routes() {
  app.get('/', function (request, reply) {
    reply.send("Hello World");
  });

  app.post('/register', async function (request, reply) {
    const username = request.body.username;
    const password = request.body.password;
    try {
      const user = await UserCredentials.findOne({username});
      if(user) {
        reply.status(400).send({usr_err: "A user with the username exists. Retry with a different username",
                                dev_err: "USER_TAKEN"});
        return;
      } else {
        let hash_pass;
        try {
          hash_pass = await bcrypt.hash(password, 10);
        } catch(err) {
          console.log(err);
          reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error hashing password"});
          return;
        }
        const new_user = new UserCredentials({username, password: hash_pass});
        try {
          await new_user.save()
          reply.send("Success");
          return;
        } catch(err) {
          console.log(err);
          reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error saving to db"});
          return;
        }
      }
    } catch(err) {
      console.log(err);
      reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error searching in db"});
      return;
    }
  });

  app.post('/login', async function(request, reply) {
    const username = request.body.username;
    const password = request.body.password;
    try {
      const user = await UserCredentials.findOne({username});
      if(!user) {
        reply.status(400).send({usr_err: "Incorrect username or password", dev_err: "INCORRECT_CREDENTIALS"});
        return;
      }
      try {
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
          reply.status(400).send({usr_err: "Incorrect username or password", dev_err: "INCORRECT_CREDENTIALS"});
          return;
        } else {
          const token = await jwt.sign({username}, JWT_SECRET);
          reply.setCookie(COOKIE_NAME, token);
          reply.status(200).send({msg: "SUCCESS"});
          return;
        }
      } catch(err) {
        console.log(err);
        reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error hashing password"});
        return;
      }
    } catch(err) {
      console.log(err);
      reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error searching in db"});
      return;
    }
  });

  app.route({
    method: 'GET',
    url: '/home',
    preValidation: app.auth([app.verifyJWT]),
    handler: (request, reply) => {
      reply.send(`Logged In as ${request.params.username}`);
    },
  });
}

app.listen(3000, function(err, address) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${address}`);
});

