// import mongoose package
const mongoose = require("mongoose"),
  path = require("path"),
  fs = require("fs");
const pemFile = path.join(__dirname, "X509-cert.pem");
//const pemFile = path.join('./config', "X509-cert.pem");
console.log(pemFile);
const credentials = [fs.readFileSync( pemFile)];
const mongoURL = process.env.MONGO_URL;
const mongoUser = process.env.MONGO_USER;

mongoose.set('strictQuery', false);
/*mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  user: mongoUser,
  sslKey: credentials,
  sslCert: credentials,
}); */

mongoose.connect(mongoURL, {
         ssl: true,
  user: mongoUser,
  sslValidate: true,
        sslCA: pemFile,
      }, function(err, db) {
  console.log(err);      
  try {
    db.close();
  } catch (error) {
  }
});


// establishing a database connection
// mongoose.connect(DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "\nConnection error:"));
connection.once("open", function () {
  console.info("We're connected!\n");
});

// export the connection object
module.exports = connection;


