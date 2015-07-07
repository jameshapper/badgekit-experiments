// hook.js
// process automatic requests to webhook ("hook" from reviewer and "accept" from earner)

var express = require('express');
var router = express.Router();
var http = require("http");
var jws = require('jws');
var logfmt = require("logfmt");
var crypto = require("crypto");
var qs = require("qs");
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var sendgrid = require('sendgrid')(process.env.SG_USER, process.env.SG_PW);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(logfmt.requestLogger());

router.post('/', function (req, res) {

    console.log("request to hook.js arrived");
    console.log("request headers are ");
    console.log(req.headers);
    var token = req.headers.authorization;
    token = token.slice(token.indexOf('"') + 1, -1);
    if (!jws.verify(token, 'HS256', 'donttell')) { //use your secret
        console.log("verification failed");
    }
    else {
        //process the data
        var decodedToken;
        try {
            decodedToken = jws.decode(token);
            console.log("decodedToken:");
            console.log(decodedToken);
            if (decodedToken.payload.body.hash !== crypto.createHash('sha256').update(JSON.stringify(req.body)).digest('hex')) {
                console.log("body hash does not match token hash");
                }
            else {
                //process review data
//                console.log("request body: ");
//                console.log(req.body);
                var action = req.body.action;
                var info = "";
                var emailTo = "";
                switch (action) {
                    //review event
                    case 'review':
                        //earner email
                        emailTo = req.body.application.learner;
                        //build badge name into email
                        info += "<p>Your application for the following badge was reviewed:" +
                            "<strong>" + req.body.application.badge.name + "</strong></p>";

                        //respond differently if approved or not
                        if (req.body.approved) {
                            info += "<p>Great news - your application was approved!</p>";
                            //include link to accept the badge
                            // - alter for your url
                            info += "<p><a href=" +
                                "'http://shielded-beach-7575.herokuapp.com/accept?badge=" +
                                req.body.application.badge.slug +
                                "&earner=" + req.body.application.learner +
                                "&application=" + req.body.application.slug +
                                "'>Accept your badge</a></p>";
                        }
                        else {
                            info += "<p>Unfortunately your application was unsuccessful this time. " +
                                "You can re-apply for the badge any time though!</p>";
                        }
                        //review includes multiple feedback and comment items
                        info += "<p>The reviewer included feedback for you:</p>";
                        info += "<ul>";
                        //comment field includes everything in the Finish page in BadgeKit Web app
                        info += "<li><em>" + req.body.review.comment + "</em></li>";
                        //review items array, one per criteria - build into list
                        var reviewItems = req.body.review.reviewItems;
                        console.log("reviewItems check: ",reviewItems);
                        var r;
                        for (r = 0; r < reviewItems.length; r++) {
                            info += "<li><em>" + reviewItems[r].comment + "</em></li>";
                            //can also include whether each criteria item was satisfied
                        }
                        info += "</ul>";
                        info += "<p><strong><em>Thanks for applying!</em></strong></p>";

                        //send email to earner with information from reviewer and link (if approved) for accepting badge
                        //I think nodemailer has been updated such that some of the code below is out of date?
/*                        var transporter = nodemailer.createTransport();
                        transporter.sendMail({
                            from: "Badge Issuer <happer@hotmail.com>", //your email
                            to: emailTo,
                            subject: "Badge", //your subject
                            generateTextFromHTML: true,
                            html: info
                        });
*/
                        //trying to work with sendgrid instead
                        sendgrid.send({
                            to: emailTo,
                            from: 'happer@hotmail.com',
                            subject: 'Badge via sendgrid',
                            text: 'My first email through SendGrid. html version should have badge information',
                            html: info
                        }, function (err, json) {
                            if (err) { return console.error(err); }
                            console.log(json);
                        });
                        console.log("info string is ", info);

                        break;
                }
            }
        } catch (err) {
            console.log("error decoding the data", err);
        }
    }
});


router.get('/accept', function (req, res) {
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
        console.log("response should be empty array: ", response);
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
