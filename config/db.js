const mongoose = require('mongoose');

const mongoURI = process.env.devURI;

// Connect to mongoDB
function connectDB() {
  try {
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      dbName: 'dev',
    }).then(() => {
      console.log("MongoDB connected");
    });
  } catch(err) {
    console.error(error);
  }
}
module.exports = connectDB;
