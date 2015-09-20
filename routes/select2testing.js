// JavaScript source code

var express = require("express");
var router = express.Router();
var utils = require('../utils.js');
var models = require('../models/activity.js');
var user = require('../models.js');
//var mongoose = require("mongoose");
var bodyParser = require('body-parser');
//app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/', utils.requireLogin, function (req, res) {
    var activity_id = req.body.activity;
    console.log('activity id is ' + activity_id);
    var email = req.user.email;
    var query = { 'email': email };
    var operator = { '$push' : { activities: activity_id } };
    user.User.update(query, operator, function (err, updated) {
        if (err) throw err;
        else {
            //call user activities list function to create object for user dashboard
            activitiesList(email, function (err, userActivities) {
                console.log("userActivities has value " + userActivities);
//                res.render('dashboard', { user: req.user });
                res.render('dashboard2', { user: req.user, Activities: userActivities });
            });
        }
    })

    function activitiesList(userEmail, callback) {
        console.log('Made it to activitiesList function');
        user.User.findOne({ 'email': userEmail }, function (err, doc) {
            var activitiesIDs = doc.activities;
            var activitiesDetails = [];
            console.log("The first id in the activities array is: " + activitiesIDs[0]);
            console.log("Total number of activities chosen is " + activitiesIDs.length);
            for (var i = 0; i < activitiesIDs.length; i++) {
 //               models.Activity.findOne({ '_id': activitiesIDs[i] }, function (err, activityDetail) {
 //                   activitiesDetails.push(activityDetail);
 //               })
                console.log("Call to db? " + models.Activity.findOne({}));
                models.Activity.findById(activitiesIDs[i], function (err, activityDetail) {
//                    console.log("activityDetail is " + activityDetail);
                    activitiesDetails.push(activityDetail);
                    if (activitiesDetails instanceof Array) console.log('Array!');
                    console.log("activitiesDetails length is " + activitiesDetails.length);
                })
            }
            console.log("As a string, the activity ID was: " + activitiesIDs[0].toString());
            console.log("activitiesDetails length at end is " + activitiesDetails.length);
            console.log("Activities details are " + activitiesDetails);
            callback(err, activitiesDetails);
        })
    }
});

module.exports = router;