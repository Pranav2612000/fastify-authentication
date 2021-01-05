const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserCredentials = require('../models/UserCredentials');

async function registerRouter (app) {
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
          reply.status(200).send({msg: "SUCCESS"});
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
};
module.exports = registerRouter;
