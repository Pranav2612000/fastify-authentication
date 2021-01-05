const mongoose = require('mongoose');

let UserCredentialsSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model('UserCredentials', UserCredentialsSchema);
