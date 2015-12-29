// JavaScript source code

var express = require("express");
var router = express.Router();
var utils = require('../../utils.js');
var actvity2 = require('../../models/activity2.js');
var user2 = require('../../models/users.js');
var util = require('util');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', utils.requireLogin, function (req, res) {
    
    var email = req.user.email;
    console.log('Made it to dashboardtest.js');
    
    //call user activities list function to create object for user dashboard
    //USE A NEW USER MODEL CALLED USER2
    activitiesList(email, function (err, userActivities) {
        
        console.log("userActivities has value " + userActivities);
        console.log(util.inspect(userActivities, false, null));
        console.log("activityName is " + userActivities.activityName);
        console.log("type of userActivities is " + typeof (userActivities));
 //       res.render('dashboard2', { user: req.user, Activities: userActivities });
    });
    
    
    function activitiesList(userEmail, callback) {
        user2.User.findOne({ 'email': userEmail }).lean().populate('activitiesTEST').exec(function (err, doc) {
            console.log("doc is " + doc);
            console.log(util.inspect(doc, false, null));
            var activitiesDetails = doc.activitiesTEST;
            callback(err, activitiesDetails);
            
        })

    }
});

module.exports = router;