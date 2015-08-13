// JavaScript source code
// I want to transfer some of the badge details data from badgekit to the user data object in Mongodb
// This is called after user selects from the badge detail view, but I didn't know how to transfer the 
// badgeData object in the link, so I'm getting data from badgekit instead
// Maybe this is just as well in the long run, since the actual select link is more likely to be from an 
// "activity detail" page, rather than a "badge detail" page that is all I have at this point.

var express = require("express");
var router = express.Router();
var http = require("http");
var jws = require('jws');
var logfmt = require("logfmt");
var crypto = require("crypto");
var qs = require("qs");
var utils = require('../utils.js');
//var mongoose = require("mongoose");
//var models = require('../models.js');
var bodyParser = require('body-parser');
//app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(logfmt.requestLogger());


router.get('/', utils.requireLogin, function (req, res) {
    //find the details for the badge and write to MongoDB

    var slug = req.query.slug;
    var badgePath = "/systems/badgekit/badges/" + slug;

    var claimData = {
        header: { typ: 'JWT', alg: 'HS256' },
        payload: {
            key: 'master',
            exp: Date.now() + (1000 * 60),
            method: 'GET',
            path: badgePath
        },
        secret: process.env.BK_SECRET
    };

    var requestOptions = {
        host: 'gentle-headland-3091.herokuapp.com',
        path: badgePath,
        method: 'GET',
        headers: { 'Authorization': 'JWT token="' + jws.sign(claimData) + '"' }
    };

    var apiRequest = http.request(requestOptions, function (apiResult) {
        var response = [];
        apiResult.setEncoding('utf8');
        apiResult.on('data', function (badgeData) {
            response.push(badgeData);
        });
        apiResult.on('end', function () {
            //process the data

            //the badge data is in "badge"
            var badgeData = JSON.parse(response.join('')).badge;
            //badge name in heading 

            res.render('dashboard', { user:req.user, badgeData: badgeData });

        });
    });

    apiRequest.on('error', function (e) {
        console.error(e);
    });
    apiRequest.end();

    //    mongoose.model('User') //still working on this
    // I think "user" should still be available, since "require login" was necessary to reach this route. So the
    // session should still be active.
    console.log('if user object is available, show user name:', req.user);
});

module.exports = router;