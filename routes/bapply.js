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

var aws = require('aws-sdk');
//app.use(bodyParser.json()); I don't think this worked, and so I switched to the following:
router.use(bodyParser.urlencoded({ extended: true }));

router.use(logfmt.requestLogger());

/*
 * Load the S3 information from the environment variables. Use "foreman start" to use .env file for local testing.
 */
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

router.get('/', function (req, res) {
    //application form
    var slug = req.query.slug;
    var badgeName = req.query.name;
    console.log(slug);
    console.log(badgeName);

    res.render('apply', { title: 'Apply for ' + badgeName, badgeName: badgeName, slug: slug });

});

/*
 * STEP 6: The keys should already be configured in heroku after getting them from AWS account
 * In AWS, they keys were given for the specific bucket "stemartisans01"
 * Respond to GET requests to /sign_s3.
 * Upon request, return JSON containing the temporarily-signed S3 request and the
 * anticipated URL of the image.
 * The JSON goes back the the account.html page, where it is parsed and used in "upload_file"
 */
router.get('/sign_s3', function (req, res) {
    aws.config.update({ accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY });
    var s3 = new aws.S3();
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            var return_data = {
                signed_request: data,
                url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

/*
 * STEP 10 (FINAL STEP, so far)
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in 
 * a way that suits your application.
 */
router.post('/bsubmit', function (req, res) {
    username = req.query.username;
    full_name = req.query.full_name;
    avatar_url = req.query.avatar_url;
    //    update_account(username, full_name, avatar_url); // TODO: create this function
    // TODO: Return something useful or redirect
});

module.exports = router;