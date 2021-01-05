const request = require("supertest");
const returnFastify = require("./setup");
const bcrypt = require('bcryptjs');

const UserCredentials = require('../models/UserCredentials');

describe("New User Registration", () => {
  test("New Users with Unique Username and Valid Password Registered Succesfully", async () => {
    /* initialize the fastify object */
    const fastify = returnFastify();

    /* make a request */
    const response = await request(fastify.server)
      .post("/register")
      .send({
          "username": "P1",
          "password": "P1",
      });
    
    /* verify request is successful */
    expect(response.body.msg).toEqual("SUCCESS");
    expect(response.status).toEqual(200);

    /* verify new user has been added to database */
    try {
      const user = await UserCredentials.findOne({username: "P1"});
      expect(user.username).toBe("P1");

      let isMatch;
      try {
        isMatch = await bcrypt.compare("P1", user.password)
        expect(isMatch).toBeTruthy();
      } catch(err) {
        console.log(err);
        throw new Error('Error decrypting password');
      }
    } catch(err) {
      console.log(err);
      throw new Error('Error finding UserCredentials in DB');
    }

    /* Delete the user added */
    try {
      await UserCredentials.findOneAndDelete({username: "P1"});
    } catch(err) {
      console.log(err);
      throw new Error('Error deleting user from db');
    }
  });
});
