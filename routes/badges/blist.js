// blist.js
// List all published badges

var express = require('express');
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
//console.log("made it to blist!");

router.get('/', function (req, res) {

    console.log("blist router.get made it!");
    var claimData = {
        header: { typ: 'JWT', alg: 'HS256' },
        payload: {
            key: 'master',
            exp: Date.now() + (1000 * 60),
            method: 'GET',
            path: '/systems/badgekit/badges?published=true'
        },
        secret: process.env.BK_SECRET
    };

    var requestOptions = {
        host: 'gentle-headland-3091.herokuapp.com',
        path: '/systems/badgekit/badges?published=true',
        method: 'GET',
        headers: { 'Authorization': 'JWT token="' + jws.sign(claimData) + '"' }
    };

    var apiRequest = http.request(requestOptions, function (apiResult) {

        //show the list of badges in HTML

        var response = [];
        apiResult.setEncoding('utf8');
        apiResult.on('data', function (badgeData) {
            response.push(badgeData);
        });
        apiResult.on('end', function () {
            //write the data out

            //parse the returned badge data, badges are in a "badges" array
            var badges = JSON.parse(response.join('')).badges;

            res.render('list', { title: 'BADGES', subtitle: 'Current Active Badges', badges: badges });
        });

    });

    apiRequest.on('error', function (e) {
        console.error(e);
    });
    apiRequest.end();
});


module.exports = router;
