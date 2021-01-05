// Configure the fastify server
const fastify = require('fastify');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');

function build() {
  const app = fastify()
  app.register(require('fastify-auth'))
  app.register(require('fastify-cookie'));

  // define the routes
  app.register(registerRouter);
  app.register(loginRouter);
  app.register(userRouter);
  return app;
}
module.exports = build;
