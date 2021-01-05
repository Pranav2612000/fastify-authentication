const request = require("supertest");
const returnFastify = require("./setup");
const bcrypt = require('bcryptjs');

const UserCredentials = require('../models/UserCredentials');

describe("Existing User Login", () => {
  test("Users Logging In With Correct Username and Password", async () => {
    /* Add a temporary user to database */
    let hash_pass;
    try {
      hash_pass = await bcrypt.hash("P2", 10);
    } catch(err) {
      console.log(err);
      throw new Error('Error hashing password when adding user to db');
    }
    const new_user = new UserCredentials({username: "P2", password: hash_pass});
    try {
      await new_user.save()
    } catch(err) {
      console.log(err);
      throw new Error('Error adding user to db');
    }

    /* initialize the fastify object */
    const fastify = returnFastify();

    /* make the login request */
    const response = await request(fastify.server)
      .post("/login")
      .send({
             "username": "P2",
             "password": "P2"
            });
    expect(response.body.msg).toEqual("SUCCESS");
    expect(response.status).toEqual(200);
  });
});
