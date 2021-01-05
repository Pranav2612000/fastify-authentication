const mongoose = require('mongoose');
const build = require("../app");

let fastify;

beforeAll(async () => {
  await mongoose.connect(global.__MONGO_URI__, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, }, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  fastify = build();
  await fastify.ready();
});

afterAll(async () => {
  await fastify.close();
  mongoose.disconnect();
});

const returnFastify = () => {
  return fastify;
}
module.exports = returnFastify;
