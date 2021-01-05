const jwt = require('jsonwebtoken');
const config = require('config');

const JWT_SECRET = config.get("JWT_SECRET");
const COOKIE_NAME = config.get("COOKIE_NAME");

function verifyJWT(request, reply, done) {
  if(!request.cookies) {
    reply.status(401).send({usr_err: "You need to be logged in to view this page", dev_err: "UNAUTHORIZED_ACCESS"});
    return;
  }
  const cookie = request.cookies[COOKIE_NAME]

  const verificationCallback = (err, data) => {
    if(err) {
      reply.status(401).send({usr_err: "You need to be logged in to view this page", dev_err: "UNAUTHORIZED_ACCESS"});
      return;
    }
    request.params.username = data.username;
    return done();
  };

  jwt.verify(cookie, JWT_SECRET, verificationCallback);
};

module.exports = verifyJWT;
