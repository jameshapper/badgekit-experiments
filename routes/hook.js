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
                console.log("request body: ");
                console.log(req.body);
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
                        var r;
//                        for (r = 0; r < reviewItems.length; r++) {
//                            info += "<li><em>" + reviewItems[r].comment + "</em></li>";
                            //can also include whether each criteria item was satisfied
//                      }
                        info += "</ul>";
                        info += "<p><strong><em>Thanks for applying!</em></strong></p>";

                        //send email to earner with information from reviewer and link (if approved) for accepting badge
                        var mail = require("nodemailer").mail;
                        mail({
                            from: "Badge Issuer <happer@hotmail.com>", //your email
                            to: emailTo,
                            subject: "Badge", //your subject
                            generateTextFromHTML: true,
                            html: info
                        });

                        break;
                }
            }
        } catch (err) {
            console.log("error decoding the data");
        }
    }
});


module.exports = router;
