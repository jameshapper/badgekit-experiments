// JavaScript source code
//APPLY PAGE

var express = require("express");
var router = express.Router();
var http = require("http");
var jws = require('jws');
var logfmt = require("logfmt");
var crypto = require("crypto");
var qs = require("qs");
var bodyParser = require('body-parser');
//app.use(bodyParser.json()); I don't think this worked, and so I switched to the following:
router.use(bodyParser.urlencoded({ extended: true }));

router.use(logfmt.requestLogger());

router.get('/', function (req, res) {
    //application form
    var slug = req.query.slug;
    var badgeName = req.query.name;
    console.log(slug);
    console.log(badgeName);

    res.render('apply', { title: 'Apply for ' + badgeName, badgeName: badgeName, slug: slug });

});

module.exports = router;