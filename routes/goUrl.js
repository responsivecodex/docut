const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const debug = require("debug")("goUrl");
const path = require("path");

debug("Module: goUrl");

/***********************************************************************
 * @route        GET /code
 * @description  Redirect to the long/original URL. Receive a Url and
 *  search it on DB, if founded throw a redirect.
 ************************************************************************/
router.post("/", async (req, res) => {
  const { shortenUrl } = req.body;
  res.setHeader("Content-Type", "application/json");
  debug("---[ /goUrl... POST]---");
  try {
    var aParts = shortenUrl.split("/");
    var urlCode = aParts[aParts.length - 1];
    // find a document match to the code in req.params.code
    const url = await Url.findOne({
      urlCode: urlCode,
    });
    if (url) {
      res.send({ shortenUrl: shortenUrl, res: { state: 0, msg: "Ready to go!", data: { data: url } } });
    } else {
      res.send({ shortenUrl: shortenUrl, res: { state: 1, msg: "Url not registered. Create it!", data: {} } });
    }
  } catch (err) {
    // exception handler
    res.send({
      shortenUrl: shortenUrl,
      res: { state: 1, msg: "Request without response, try later.", data: { err: JSON.stringify(err) } },
    });
  }
});

router.get("/", async (req, res) => {
  const shortenUrl = "";
  try {
    const baseUrl = process.env.BASE_URL;
    res.setHeader("Content-Type", "text/html");
    debug("---[ /goUrl... GET]---");
    const shortenUrl = encodeURI(req.originalUrl.replace(/\//gi, ""));
    if (/(.*)(\.xml)(\/)?/.test(shortenUrl)) {
      res.setHeader('Content-Type', 'application/xml');
      res.sendFile( path.join(__dirname,'../public', shortenUrl ) );
    } else {
      if (/[(%=$&#"'~)]/.test(shortenUrl) || shortenUrl.length !== 21) {
        res.render("template", {
          dataHead: {
            includeCSS: ["/css/index"],
            includeJS: ["/scripts/index"],
          },
          partial: "partials/index",
          data: {
            msgShortenUrl: "",
            shortenUrl: "",
            msgGoUrl: "Url invalid",
            goUrl: baseUrl + "/" + shortenUrl,
            state: 1,
            err: {},
          },
        });
      } else {
        // find a document match to the code in req.params.code
        const url = await Url.findOne({
          urlCode: shortenUrl,
        });
        if (url) {
          res.setHeader("Content-Type", "text/plain");
          // when valid we perform a redirect
          return res.redirect(url.longUrl);
        } else {
          res.render("template", {
            dataHead: {
              includeCSS: ["/css/index"],
              includeJS: ["/scripts/index"],
            },
            partial: "partials/index",
            data: {
              msgShortenUrl: "",
              shortenUrl: "",
              msgGoUrl: "Url not registered. Create again!",
              goUrl: baseUrl + "/" + shortenUrl,
              state: 1,
              err: {},
            },
          });
        }
      }
    }
  } catch (err) {
    res.render("template", {
      dataHead: {
        includeCSS: ["/css/index"],
        includeJS: ["/scripts/index"],
      },
      partial: "partials/index",
      data: {
        msgShortenUrl: "",
        shortenUrl: "",
        msgGoUrl: "Request without response, try later.",
        goUrl: "",
        state: 1,
        err: {},
      },
    });
    //res.send({ shortenUrl: shortenUrl, res: { state: 1, msg: "Request without response, try later.", data: { err: JSON.stringify(err) } }, });
  }
});

module.exports = router;
