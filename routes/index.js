var express = require('express');
var router = express.Router();
var utils = require('../utils.js');

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

//HOME PAGE
router.get('/', function (req, res) {
   // res.send('Stem Artisans Home Page');
    res.render('home', {});
});

//ABOUT US PAGE
router.get('/about', function (req, res) {
    res.render('about', {});
});

//REGISTER, LOGIN, and LOGOUT routes
router.use('/auth', require('./auth.js'));

//USER DASHBOARD--validation takes place in dashboard.js with requireLogin utility
router.use('/dashboard', require('./userdata/dashboard.js'));
router.use('/select', require('./userdata/select.js'));

//ALTERNATE DASHBOARD FOR TESTING
router.use('/dashboardtest', require('./userdata/dashboardtest.js'));

/**
 * /activityprogress            This is meant to show any notes and comments that are associated with the given activity
 *                              which is part of the user's current focus
 * 
 * arguments:
 *              :useractivity   a parameter that should be a valid ObjectId for an activity referenced in the user collection
 *                              within the "activities" array
 * 
 * failures:
 *              :useractivity not a valid activity in the user activity array. The call to the Activity model will return err.
 *              We can return to user dashboard with a request to try again.
 *              
 *              note for the specific user and activity is not found
 *         
 * 
 **/

router.get('/activityprogress/:useractivity', utils.requireLogin, function (req, res) {
    
    //this route should be accessed by the user dashboard and include "useractivity" as a parameter
    //in the url
    //DATABASE ACCESS
    //   Activities collection
    //   Notes collection
    //   (Comments collection via "populate" of Note)
    
    var models = require('../models/activity.js');
    var notes = require('../models/notes.js');
    var comments = require('../models/comments.js');
    
    comments.Comment.findOne();

    var email = req.user.email;
    var useractivity = req.params.useractivity;
    req.activityId = useractivity;
    
    console.log('email is ' + email);
    console.log('activity id is ' + useractivity);
    
    activityProgress(email, useractivity, function (err, activityDetail, Notes) {
        if (err) return next(err);

//        console.log('Activity detail is ' + activityDetail);
//        console.log("type of activityDetail is " + typeof (activityDetail));
//        console.log('Notes should include comments here ' + Notes);//CONSOLE LOGS; UNCOMMENT IF NEEDED
        res.render('activityprogress', { activityDetail: activityDetail, notes: Notes });
    });
    
    function activityProgress(userEmail, useractivity, callback) {
        
        models.Activity.findById(useractivity, function (err, activityDetail) {
            if (err) return next(err);
            if (!activityDetail) return next(new Error('We were not able to find the activity.')) ;

            notes.Note.find({ authorId: userEmail, activityId: useractivity}).populate('comments').exec(function(err, noteswithcomments){

                console.log('note should include comments ' + noteswithcomments);
                if (err) return callback(err, null, null);
                callback(err, activityDetail, noteswithcomments);

            });
        })
    }
});

router.use('/notes', require('./userdata/notes.js'));
//router.use('/addcomment',require('./addcomment.js');

/**
 * router.use('/tag/:tag', ...) We want the teacher to be able to see all posts by tag
 * router.use('/students/:views', ...) We want the teacher to be able to see all posts and/or all comments by date
 * An alternative is to follow the structure from the MongoUniversity blog example. In this case, I
 * would use a variety of "handlers". They have handlers for sessions, content, and errors. What would
 * be most natural for this app? Perhaps badgehandler, contenthandler (for activities), userviewshandler?
 * In addition, they use "Data Access Objects" which are full of functions that access the various
 * collections in MongoDB. I think the idea here, is that some of these functions can be used in a
 * variety of contexts.
 */

//ACTIVITIES ROUTES--list activities and provide paths to details
router.use('/electronicspathways', require('./activities/electronicspathways.js'));
router.use('/activities', require('./activities/activities.js'));
//We also want to add a route to see details of a particular activity
//This could be added as a /permalink route from the /activities route above?

//BADGEKIT and BADGEKIT API ACCESS
router.use('/blist', require('./badges/blist.js'));
router.use('/bdetail', require('./badges/bdetail.js'));
router.use('/bapply', require('./badges/bapply.js'));
router.use('/bsubmit', require('./badges/bsubmit.js'));
router.use('/hook', require('./badges/hook.js'));
router.use('/accept', require('./badges/accept.js'));

// Any route that we haven't specified gets this message
router.get('*', function (req, res) {
    res.send("Page not found");
});


module.exports = router;
