// JavaScript source code
//Push selected activity id to user collection in MongoDB

var express = require("express");
var router = express.Router();
var http = require("http");
var jws = require('jws');
var logfmt = require("logfmt");
var crypto = require("crypto");
var qs = require("qs");
var bodyParser = require('body-parser');
router.use(bodyParser.json()); //I'm not sure if this works...
router.use(bodyParser.urlencoded({ extended: true }));

router.use(logfmt.requestLogger());

router.post('/', function (req, res) {
    //
    var applicationPath = "/systems/badgekit/badges/" + req.body.slug + "/applications";
    console.log("applicationPath", applicationPath);


    var appData = qs.stringify({
        learner: req.body.email,
        evidence: [{ reflection: req.body.evidence }]
    });

    console.log("appData", appData);

    var claimData = {
        header: { typ: 'JWT', alg: 'HS256' },
        payload: {
            key: 'master',
            exp: Date.now() + (1000 * 60),
            method: 'POST',
            path: applicationPath,
            body: {
                alg: "sha256",
                //   alg: 'SHA256',
                hash: crypto.createHash('sha256').update(appData).digest('hex')
            }
        },
        secret: process.env.BK_SECRET
    };

    var requestOptions = {
        host: 'gentle-headland-3091.herokuapp.com',
        path: applicationPath,
        method: 'POST',
        headers: {
            'Authorization': 'JWT token="' + jws.sign(claimData) + '"',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(appData)
        }
    };

    var postRequest = http.request(requestOptions, function (appResponse) {
        //respond
        var response = [];
        appResponse.setEncoding('utf8');
        appResponse.on('data', function (responseData) {
            console.log('Response: ' + responseData);
            response.push(responseData);
        });
        appResponse.on('end', function () {
            //data end
            var appStatus = JSON.parse(response.join('')).status;
            if (appStatus === "created") {
                res.render('submit',{});
            }
            else {
                res.send("Whoops! Something went wrong with your application.");
            }
        });
    });
    postRequest.on('error', function (e) {
        console.error(e);
    });

    //write the application data
    postRequest.write(appData);
    postRequest.end();
});

module.exports = router;