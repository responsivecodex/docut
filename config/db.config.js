// import mongoose package
const mongoose = require("mongoose"),
  path = require("path"),
  fs = require("fs");

const credentials = fs.readFileSync(path.join(__dirname, "X509-cert-5638763018129466000.pem"));
const mongoURL = process.env.MONGO_URL;
const mongoUser = process.env.MONGO_USER;

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true,
  user: mongoUser,
  sslKey: credentials,
  sslCert: credentials,
});

// establishing a database connection
// mongoose.connect(DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })

const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "\nconnection error:"));
connection.once("open", function () {
  console.info("We're connected!\n");
});

// export the connection object
module.exports = connection;
