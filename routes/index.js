var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.user.username);
    res.redirect('/books');
});

module.exports = router;
