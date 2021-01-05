const verifyJWT = require('../decorators/jwt');

async function userRouter(app) {
  app.decorate("verifyJWT", verifyJWT);
  app.addHook('preHandler', app.auth([app.verifyJWT]));
  app.route({
    method: 'GET',
    url: '/home',
    handler: (request, reply) => {
      reply.send(`Logged In as ${request.params.username}`);
    },
  });
};
module.exports = userRouter;
