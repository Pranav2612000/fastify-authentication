const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');

const UserCredentials = require('../models/UserCredentials');

const JWT_SECRET = config.get("JWT_SECRET");
const COOKIE_NAME = config.get("COOKIE_NAME");

async function loginRouter(app) {
  app.post('/login', async function(request, reply) {
    const username = request.body.username;
    const password = request.body.password;
    try {
      const user = await UserCredentials.findOne({username});
      if(!user) {
        reply.status(401).send({usr_err: "Incorrect username or password", dev_err: "INCORRECT_CREDENTIALS"});
        return;
      }
      try {
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
          reply.status(401).send({usr_err: "Incorrect username or password", dev_err: "INCORRECT_CREDENTIALS"});
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
};
module.exports = loginRouter;
