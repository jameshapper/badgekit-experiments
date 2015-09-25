// JavaScript source code

var express = require("express");
var router = express.Router();
var utils = require('../../utils.js');
var models = require('../../models/activity.js');
var user = require('../../models.js');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', utils.requireLogin, function (req, res) {
    
    var email = req.user.email;
    console.log('Made it to dashboard.js');
    
    //call user activities list function to create object for user dashboard
    activitiesList(email, function (err, userActivities) {
        console.log("userActivities has value " + userActivities);
        console.log("first activityName is " + userActivities[0].activityName);
        console.log("type of userActivities is " + typeof (userActivities));
        res.render('dashboard2', { user: req.user, Activities: userActivities });
    });
    
    
    function activitiesList(userEmail, callback) {
/*        user.User.find({ 'email': userEmail }).populate('Activity').exec(function (err, doc) {
            console.log("doc is " + doc);
            var activitiesDetails = doc.activities;
            callback(err, activitiesDetails);
*/
        user.User.findOne({ 'email': userEmail }, function (err, doc) {
            var activitiesIDs = doc.activities;
            if (activitiesIDs.length == 0) {
                res.render('dashboard');
            }
            console.log("activitiesIDs are " + activitiesIDs);
            var activitiesDetails = [];
            console.log("The second id in the activities array is: " + activitiesIDs[1]);
            console.log("Total number of activities chosen is " + activitiesIDs.length);
            var activityCount = 0; //need this to deal with asynchronous loop that follows
            for (var i = 0; i < activitiesIDs.length; i++) {
                models.Activity.findById(activitiesIDs[i], function (err, activityDetail) {
                    activitiesDetails.push(activityDetail);
                    console.log("activitiesDetails length is " + activitiesDetails.length);
                    console.log("type of activitiesIDs 0 is " + typeof (activitiesIDs[0]));
                    console.log("value of activitiesIDs 0 is " + activitiesIDs[0]);
                    console.log("activitiesDetails.activityName is " + activitiesDetails[0].activityName);
                    if (++activityCount == activitiesIDs.length) {
                        callback(err, activitiesDetails);
                    }
                })
            }
            console.log("activitiesDetails length at end is " + activitiesDetails.length);
        })

    }
});

module.exports = router;