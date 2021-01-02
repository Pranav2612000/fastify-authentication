const fastify = require('fastify');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserCredentials = require('./models/UserCredentials');

const mongoURI = process.env.MONGO_URI ||
  "mongodb+srv://root:root@cluster0.znemd.mongodb.net/<dbname>?retryWrites=true&w=majority";

const COOKIE_NAME = "SESSION_ID";
const JWT_SECRET = "HELL0_w0RLd";

// Connect to mongoDB
try {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    dbName: 'dev',
  }).then(() => {
    console.log("MongoDB connected");
  });
} catch(err) {
  console.error(error);
}

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
      reply.send("Home");
    },
  });
}

function verifyJWT(request, reply, done) {
  if(!request.cookies) {
    reply.status(400).send({usr_err: "You need to be logged in to view this page", dev_err: "UNAUTHORIZED_ACCESS"});
    return;
  }
  const cookie = request.cookies[COOKIE_NAME]

  const verificationCallback = (err, data) => {
    if(err) {
      reply.status(400).send({usr_err: "You need to be logged in to view this page", dev_err: "UNAUTHORIZED_ACCESS"});
      return;
    }
    request.params.username = data.username;
    return done();
  };

  jwt.verify(cookie, JWT_SECRET, verificationCallback);
};


app.listen(3000, function(err, address) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${address}`);
});

