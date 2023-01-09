// packages needed in this file
const express = require("express");
const validUrl = require("valid-url");
const { nanoid } = require("nanoid");
const router = express.Router();
const Url = require("../models/Url"); // import the Url database model
const debug = require("debug")("shortenUrl");
const connection = require("../config/db.config");
const path = require("path");

debug("\n\nModule: shortenUrl");

// The API base Url endpoint

/*****************************************************************
 * @route    POST /shorten
 * @description It receives a URL and returns a trimmed URL by using nanoid
 *  which generates a short string, this string and the original URL are
 *  stored in the database. Thus, when the user enters the trimmed URL
 *  in their navigation bar, it actually makes a request for the original
 *  Url, if it exists in the system it is redirected to the URL otherwise
 *  it receives a notification.
 *****************************************************************/
router.post("/", async (req, res) => {
  try {
    var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;

    const baseUrl = process.env.BASE_URL;
    const longUrl = encodeURI(req.body.longUrl);
    const reuse = encodeURI(req.body.reuse);
    const maxByDay = (/(localhost)/.test(baseUrl)) ? 2:500;

    res.setHeader("Content-Type", "text/json");
    debug("baseUrl: "+baseUrl);
    // Validate because on production maybe return fail at get hostname
    if (!validUrl.isUri(baseUrl)) {
      res.send({ longUrl: longUrl, res: { state: 1, msg: "Verify base Url", data: {} } });
    } else {
      // Validate Url...
      if (validUrl.isUri(longUrl)) {
        try {
          // S.I.: Filter attack by one IP
          const countIP = await Url.countDocuments({ ip: ip });
          if (!(countIP <= 15 || (countIP > 15 && reuse === "Yes"))) {
            res.send({
              longUrl: longUrl,
              res: {
                state: 5,
                msg: "You have reached the maximum allowed (15), do you want to delete the oldest URL?",
                data: "",
                aviso: "You have reached the maximum allowed (15), do you want to delete the oldest URL?"
              },
            });
          } else {
            //var d = getDateAsNumber( (new Date()).getTime() );
            //const countDayOpers = await transactions((new Date()).getTime());
            const countDayOpers = await Url.countDocuments({ date: getDateAsNumber( new Date() ) });
            if (countDayOpers > maxByDay) {
              res.send({
                longUrl: longUrl,
                res: { state: 6, msg: "Today we are worked too much!, please return tomorrow.", data: "" },
              });
            } else {
              /* Validate the existence of Url on database, if exists just return it else create a record*/
              let shortenUrl = await Url.findOne({
                longUrl,
              });

              // url exist and return the respose
              if (shortenUrl) {
                res.send({
                  longUrl: longUrl,
                  res: { state: 0, msg: "You have this!", data: JSON.stringify(shortenUrl) },
                });
              } else {
                // join the generated short code the the base url
                const urlCode = nanoid();
                const shortUrl = path.join(baseUrl, urlCode);

                // Using the Url model and saving to the DB
                shortenUrl = new Url({
                  longUrl,
                  shortUrl,
                  urlCode,
                  ip,
                  date: getDateAsNumber(),
                });
                await shortenUrl.save();
                res.send({ longUrl: longUrl, res: { state: 0, msg: "You get it!", data: JSON.stringify(shortenUrl) } });
              }
            }
          }
        } catch (err) {
          debug(err);
          res.send({ longUrl: longUrl, res: { state: 2, msg: JSON.stringify( err ), data: { err: err } } });
        }
      } else {
        res.send({ longUrl: longUrl, res: { state: 1, msg: "Ooopss!  It's not a valid Url", data: {} } });
      }
    }
  } catch (err) {
    debug(err);
    res.send({ longUrl: longUrl, res: { state: 2, msg:  JSON.stringify( err ), data: { err: err } } });
  }
});

const transactions = (startDate = (new Date())) => {
  return Url.find({
    date: {
      $gte: getDateAsNumber(new Date(startDate).setHours(00, 00, 00, 00)),
      $lte: getDateAsNumber(new Date(startDate).setHours(23, 59, 59, 00)),
    },
  }).sort({ date: "asc" });
};

const getDateAsNumber = (date= (new Date())) => {
  const value = new Date(new Date(date).setHours(00, 00, 00, 00)).getTime();
  return value;
}

module.exports = router;
