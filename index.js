const fastify = require('fastify');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('config');

const connectDB = require('./config/db');

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const userRouter = require('./routes/user');

// Connect to DB
connectDB();

// Configure the fastify server
const app = fastify()
app.register(require('fastify-auth'))
app.register(require('fastify-cookie'));

// define the routes
app.register(registerRouter);
app.register(loginRouter);
app.register(userRouter);

app.listen(3000, function(err, address) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${address}`);
});
