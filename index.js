const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');

const build = require('./app');

// Connect to DB
connectDB();

// start the server
const app = build();
app.listen(3000, function(err, address) {
  if(err) {
    console.log(err);
    process.exit(1);
  }
  console.log(`Server listening on port ${address}`);
});
module.exports = build;
