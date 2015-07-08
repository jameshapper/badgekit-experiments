// accept.js
// process requests to accept badge from an earner email link (provided by hook.js)

var express = require("express");
var router = express.Router();
var http = require("http");
var jws = require('jws');
var logfmt = require("logfmt");
var crypto = require("crypto");
var qs = require("qs");
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(logfmt.requestLogger());

router.get('/', function (req, res) {
    //issue the badge

    var badgeSlug = req.query.badge;
    var earner = req.query.earner;
    var application = req.query.application;

    var awardPath = "/systems/badgekit/badges/" + badgeSlug + "/instances";

    var awardData = qs.stringify({
        email: earner
    });

    console.log("awardPath", awardPath);
    console.log("awardData", awardData);

    var claimData = {
        header: { typ: 'JWT', alg: 'HS256' },
        payload: {
            key: 'master',
            exp: Date.now() + (1000 * 60),
            method: 'POST',
            path: awardPath,
            body: {
                alg: "sha256",
                hash: crypto.createHash('sha256').update(awardData).digest('hex')
            }
        },
        secret: 'donttell'
    };

    var requestOptions = {
        host: 'gentle-headland-3091.herokuapp.com',
        path: awardPath,
        method: 'POST',
        headers: {
            'Authorization': 'JWT token="' + jws.sign(claimData) + '"',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(awardData)
        }
    };

    var postRequest = http.request(requestOptions, function (acceptResponse) {
        var response = [];
        console.log("response should be empty array: ",response);
        acceptResponse.setEncoding('utf8');
        acceptResponse.on('data', function (responseData) {
            response.push(responseData);
            console.log("response should be adding data: ", response);
        });
        acceptResponse.on('end', function () {
            //join chunks in reponse array into a string and then turn into JSON
            //should include "created", "slug", "email", "expires", "issuedOn", "assertionUrl"
//            var awardData = JSON.parse(response.join(''));
//            console.log('accept response: ' + response.join(''));//output all at once
/*
                        if (awardData.status === "created") { //status created
                            res.render('accept', {});
            
                            //mark application as processed
                            processApplication(badgeSlug, application);//we will add this next
            
                            function processApplication(bdgSlug, appSlug) {
                                //process application
                                var processPath = "/systems/badgekit/badges/" + bdgSlug + "/applications/" + appSlug;
                                var proc = new Date();
                                var processData = qs.stringify({
                                    processed: proc
                                });
                                var claimData = {
                                    header: { typ: 'JWT', alg: 'HS256' },
                                    payload: {
                                        key: 'master',
                                        exp: Date.now() + (1000 * 60),
                                        method: 'PUT',
                                        path: processPath,
                                        body: {
                                            alg: "SHA256",
                                            hash: crypto.createHash('SHA256').update(processData).digest('hex')
                                        }
                                    },
                                    secret: 'donttell'
                                };
            
                                var requestOptions = {
                                    host: 'gentle-headland-3091.herokuapp.com',
                                    path: processPath,
                                    method: 'PUT',
                                    headers: {
                                        'Authorization': 'JWT token="' + jws.sign(claimData) + '"',
                                        'Content-Type': 'application/x-www-form-urlencoded',
                                        'Content-Length': Buffer.byteLength(processData)
                                    }
                                };
            
                                var putRequest = http.request(requestOptions, function (processResponse) {
                                    var response = [];
                                    processResponse.setEncoding('utf8');
                                    processResponse.on('data', function (responseData) {
                                        response.push(responseData);
                                    });
                                    processResponse.on('end', function () {
                                        console.log("process response: " + response.join(''));
                                    });
                                });
            
                                putRequest.on('error', function (e) {
                                    console.error(e);
                                });
                                // post the data--this should update the application as processed so
                                // so it should no longer show up on the review page
                                putRequest.write(processData);
                                putRequest.end();
                            }
                        }
                        else {
                            res.send("Whoops! Something went wrong with your badge.");
                        }
*/
                    });
                });

                postRequest.on('error', function (e) {
                    console.error(e);
                });

    // post the data--I believe this leads to the creation of the badge instance/  
//                postRequest.write(awardData);
//                postRequest.end();
        
});



module.exports = router;