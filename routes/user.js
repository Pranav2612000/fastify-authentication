const verifyJWT = require('../decorators/jwt');

async function userRouter(app) {
  app.decorate("verifyJWT", verifyJWT)
  app.route({
    method: 'GET',
    url: '/home',
    preValidation: app.auth([app.verifyJWT]),
    handler: (request, reply) => {
      reply.send(`Logged In as ${request.params.username}`);
    },
  });
};
module.exports = userRouter;
