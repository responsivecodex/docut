  const createError = require("http-errors"),
  express = require("express"),
  path = require("path"),
  cookieParser = require("cookie-parser"),
  logger = require("morgan"),
  rcConfig = require("./rc-config.json"),
  indexRouter = require("./routes/partials/index"),
  shortenUrl = require("./routes/shortenUrl"),
  goUrl = require("./routes/goUrl"),
  healthzRouter = require("./routes/healthz"),
  localeMiddleWare = require("./middleware/locale"),
  publicFolder = path.join(__dirname, "public");
var app = express();

console.log("Module: app");
console.log("\n\nWake Up Sleeping Beauty...");
console.log("Entorno: [" + (rcConfig.setup.environment === "development" ? "development]" : "production]"));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(publicFolder, { maxAge: rcConfig.setup.maxAgeCookies }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static(publicFolder));
app.use("/assets", express.static(path.join(__dirname, "/node_modules")));

app.use(logger("dev"));
app.use(cookieParser());

// Database config
const connection = require("./config/db.config");
connection.once("open", () => console.log("DB Connected\n"));
connection.on("error", () => console.log("Error on BD\n"));

let setCache = function (req, res, next) {
  // here you can define period in second, this one is 5 minutes
  const period = 60 * 5 

  // you only want to cache for GET requests
  if (req.method == 'GET') {
    res.set('Cache-control', 'public, max-age=3');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('Cache-Control', 'no-store');

  } else {
    // for the other requests set strict no caching parameters
    res.set('Cache-control', `no-store`)
  }

  // remember to call next() to pass on the request
  next()
}

// now call the new middleware function in your app

app.use(setCache)

app.use(localeMiddleWare);
app.use("/healthz", healthzRouter);
app.use("/shorten", shortenUrl);
app.use("/goUrl", goUrl);
app.use("/:code", goUrl);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.redirect("/");
});


console.log("Environment vars:");
console.log("BASE_ENV: " + process.env.BASE_URL);


module.exports = app;



