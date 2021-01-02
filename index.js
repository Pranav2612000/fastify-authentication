const fastify = require('fastify');
const app = fastify();

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
