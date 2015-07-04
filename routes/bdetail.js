// JavaScript source code
//BADGE DETAILS PAGE

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
    //show the details for this badge

    var slug = req.query.slug;
    var badgePath = "/systems/badgekit/badges/" + slug;
    console.log(badgePath);

    var claimData = {
        header: { typ: 'JWT', alg: 'HS256' },
        payload: {
            key: 'master',
            exp: Date.now() + (1000 * 60),
            method: 'GET',
            path: badgePath
        },
        secret: 'donttell'
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

            res.render('detail', { title: 'BADGE DETAIL', badgeData: badgeData });

        });
    });

    apiRequest.on('error', function (e) {
        console.error(e);
    });
    apiRequest.end();
});

module.exports = router;