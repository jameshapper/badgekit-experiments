// JavaScript source code

var express = require("express");
var router = express.Router();
var utils = require('../../utils.js');
var models = require('../../models/activity.js');
var user = require('../../models/users.js');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));


router.get('/', utils.requireLogin, function (req, res) {
    
    var email = req.user.email;
    
    activitiesList(email, function (err, userActivities) {
//        console.log("userActivities has value " + userActivities);
//        console.log("first activityName is " + userActivities[0].activityName);
        //        console.log("type of userActivities is " + typeof (userActivities));//LOG ACTIVITIES; UNCOMMENT IF NEEDED
        if (err) {
            var err = new Error('Problem in activitiesList');
            next(err)
        }
//        res.render('dashboard2', { user: req.user, Activities: userActivities });
        res.render('dashboardTEST', { user: req.user, Activities: userActivities });
    });
    
    /**
     * activitiesList               Purpose is to list the user's chosen activities (courses) along with their criteria
         *                          on the user dashboard. So we need to find the user's activities from the activities 
         *                          array in the user doc. These are ObjectID's that need to be populated to that a useful
         *                          object can be sent to the view.   
     *                          
     *                              I am currently rendering dashboard or dashboard2, but I know I will combine these soon.
     *                              I want to first learn about angular.js before putting if statements into a single jade view.
     * 
     * arguments:   
         * 
         * userEmail       String   The user model requires email to be unique. The request object should have 
         *                          the user details on it.
     * 
     * 
     * failures:
     *          
     * 
     **/

    
    function activitiesList(userEmail, callback) {
/*        user.User.find({ 'email': userEmail }).populate('Activity').exec(function (err, doc) {
            console.log("doc is " + doc);
            var activitiesDetails = doc.activities;
            callback(err, activitiesDetails);
*///I tried a method like this to populate the activities array (see dashboardtest.js), but I think something didn't work
        user.User.findOne({ 'email': userEmail }, function (err, doc) {
            if (err) return next(err);
            if (!doc) return next(new Error('User document not found in activitiesList function'));

            var activitiesIDs = doc.activities;
            if (activitiesIDs.length == 0) {
                res.render('dashboard');
            }
            console.log("activitiesIDs are " + activitiesIDs);
            var activitiesDetails = [];
//            console.log("The second id in the activities array is: " + activitiesIDs[1]);
//            console.log("Total number of activities chosen is " + activitiesIDs.length);//Console logs
            var activityCount = 0; //need this to deal with asynchronous loop that follows. It seems like a neat trick, but I thought populate would
                                    //the the correct shortcut. Anyway, I'll leave it for now, since it seems to work.
            for (var i = 0; i < activitiesIDs.length; i++) {
                models.Activity.findById(activitiesIDs[i], function (err, activityDetail) {
                    activitiesDetails.push(activityDetail);
//                    console.log("activitiesDetails length is " + activitiesDetails.length);
//                    console.log("type of activitiesIDs 0 is " + typeof (activitiesIDs[0]));
//                    console.log("value of activitiesIDs 0 is " + activitiesIDs[0]);
//                    console.log("activitiesDetails.activityName is " + activitiesDetails[0].activityName);//Console logs
                    if (++activityCount == activitiesIDs.length) {
                        callback(err, activitiesDetails);
                    }
                })
            }
//            console.log("activitiesDetails length at end is " + activitiesDetails.length);//Console logs
        })

    }
});

module.exports = router;