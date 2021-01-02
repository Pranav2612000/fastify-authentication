const fastify = require('fastify');
const mongoose = require('mongoose');
const UserCredentials = require('./models/UserCredentials');

const app = fastify();
const mongoURI = process.env.MONGO_URI ||
  "mongodb+srv://root:root@cluster0.znemd.mongodb.net/<dbname>?retryWrites=true&w=majority";

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
    } else {
      const new_user = new UserCredentials({username, password});
      try {
        await new_user.save()
      } catch(err) {
        console.log(err);
        reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error saving to db"});
      }
    }
  } catch(err) {
    console.log(err);
    reply.status(500).send({usr_err: "Something went wrong! Please try again", dev_err: "Error searching in db"});
  }
  reply.send("Success");
});

app.listen(3000, function(err, address) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${address}`);
});
