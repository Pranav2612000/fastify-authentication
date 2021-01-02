const fastify = require('fastify');
const mongoose = require('mongoose');

const app = fastify();
const mongoURI = process.env.MONGO_URI ||
  "mongodb+srv://root:<password>@cluster0.znemd.mongodb.net/<dbname>?retryWrites=true&w=majority";

try {
  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    dbName: 'dev',
  });
} catch(err) {
  console.error(error);
}

app.get('/', function (request, reply) {
  reply.send("Hello World");
});

app.listen(3000, function(err, address) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${address}`);
});
