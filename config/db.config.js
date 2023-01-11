// import mongoose package
const mongoose = require("mongoose"),
  path = require("path"),
  fs = require("fs");
const pemFile = path.join(__dirname, "X509-cert.pem");
const credentials = [fs.readFileSync(pemFile)];
const mongoURL = process.env.MONGO_URL;
const mongoUser = process.env.MONGO_USER;

console.log("Trying to connect to Atlas....");

mongoose.set('strictQuery', false);
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  user: mongoUser,
  sslKey: pemFile,
  sslCert: pemFile,
}).then(
  () => {
    console.log("Ready to use Atlas!");
  },
  err => {
    console.log("\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\nFail to connect Atlas...");
    console.log(err);
    try {
      db.close();
    } catch (error) {
    }
  }
);;

const connection = mongoose.connection;

// export the connection object
module.exports = connection;


