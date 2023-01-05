const debug = require("debug")("locale");

const localeMiddleware = (req, res, next) => {
  let lang = req.headers["accept-language"];
  debug(' req.headers["accept-language"] == '+lang);
  let aLang = lang.split(/[,;]/);
  process.env.lang = "en-US";
  for (var i = 0; i < aLang.length; i++) {
    if (/(EN-)([A-Z]{2})/.test(aLang[i].toUpperCase())) {
      process.env.lang = "en-US";
      break;
    } else if (/(ES-)([A-Z]{2}|419)/.test(aLang[i].toUpperCase())) {
      process.env.lang = "es-MX";
      break;
    }
  }
  next();
};

module.exports = localeMiddleware;
