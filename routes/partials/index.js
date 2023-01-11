const express = require("express");
const debug = require("debug")("index");
const router = express.Router();

debug("\n\nModule: index");

router.get("/", async (req, res) => {
  debug(req.hostname);
  debug(req.ip);
  debug("process env ==> " + JSON.stringify(process.env));
  const shortenUrl = encodeURI(req.originalUrl.replace(/\//gi, ""));
  const jsonLocale = require( '../../middleware/'+process.env.lang);

  res.render("template", {
    dataHead: {
      includeCSS: ["/css/index"],
      includeJS: ["/scripts/index"],
    },
    partial: "partials/index",
    data: {
      msgShortenUrl: "",
      shortenUrl: "",
      msgGoUrl: "",
      goUrl: "",
      state: 1,
      err: {},
    },
    lang: jsonLocale
  });
});

module.exports = router;


