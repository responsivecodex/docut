var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/healthz', function(req, res, next) {
    res.status(200).sendFile(path.join(__dirname, "../views", "healthz"));
});

module.exports = router;


