const request = require("supertest");
const returnFastify = require("./setup");

describe("New User Registration", () => {
  test("New Users with Unique Username and Valid Password Registered Succesfully", async () => {
    const fastify = returnFastify();
    const response = await request(fastify.server)
      .post("/register")
      .send({
          "username": "P1",
          "password": "P1",
      });
    
    expect(response.body.msg).toEqual("SUCCESS");
    expect(response.status).toEqual(200);
  });
});
