/*
SOME CONSOLE LOGS OF THIS FAILURE
email is test@ test.com
00:47:51 web.1  | activity id is 55d043414e3bade77a2e2804
00:47:51 web.1  | note should include comments { commentss:
    00:47:51 web.1  |    [ { _id: 55eb31980595c1db79d790c2,
00:47:51 web.1  |        noteId: 55e86916e4d080ea062109af,
00:47:51 web.1  |        author: 'Ri',
00:47:51 web.1  |        body: 'This is a second comment that should be associated with the FirstNote post' } ],
00:47:51 web.1  |   _id: 55e86916e4d080ea062109af,
00:47:51 web.1  |   authorId: 'test@test.com',
00:47:51 web.1  |   activityId: '55d043414e3bade77a2e2804',
00:47:51 web.1  |   title: 'FirstNote',
00:47:51 web.1  |   body: 'I wanted to have a note in the db to play around with. This should show up under the Bitrex activity on the user dashboard, if all goes well' }
00:47:51 web.1  | trying note.commentss undefined
00:47:51 web.1  | note should include comments { commentss:
00:47:51 web.1  |    [ { _id: 55e86a5ee4d080ea062109b0,
00:47:51 web.1  |        noteId: 55ea230b0595c1db79d790c1,
00:47:51 web.1  |        author: 'Luke',
00:47:51 web.1  |        body: 'This should follow the note under the Bitrex activity on the user dashboard. It was written by Luke' } ],
00:47:51 web.1  |   _id: 55ea230b0595c1db79d790c1,
00:47:51 web.1  |   authorId: 'test@test.com',

TO NOTICE: THE COMMENTSS ARRAY HAS SHOWN UP (ACCORDING TO THE LOG OF 'NOTES', BUT IF I TRY TO ACCESS NOTE.COMMENTSS I GET 'UNDEFINED')
*/

/*
THERE IS ANOTHER BEHAVIOR THAT HAS ALSO SCREWED ME HERE.IF I TRY TO SEND THE GET REQUEST TO ITS OWN ROUTE FILE BY USING ROUTER.USE HERE, I THINK THE NOTE ID IS SENT A FEW TIMES OR SOMETHING.THAT IS WHY I CURRENTLY HAVE THE ROUTE DETAILS SITTING IN THIS INDEX FILE
*/


var express = require('express');
var router = express.Router();
var utils = require('../utils.js');

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
router.use('/dashboard', require('./dashboard.js'));
router.use('/select', require('./select.js'));

/*
router.get('/activityprogress/:useractivity', utils.requireLogin, function (req, res) {
    var useractivity = req.params.useractivity;
    console.log('activity id is ' + useractivity);
    res.redirect('../dashboard')
});
*/
var models = require('../models/activity.js');
var notes = require('../models/notes.js');
var comments = require('../models/comments.js');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));

//router.use('/activityprogress/:useractivity', require('./activityprogress.js'));


router.get('/activityprogress/:useractivity', utils.requireLogin, function (req, res) {
    
    //this route should be accessed by the user dashboard and include "useractivity" as a parameter
    //in the url
    
    var async = require('async');
    
    var email = req.user.email;
    var useractivity = req.params.useractivity;
    req.activityId = useractivity;
    
    console.log('email is ' + email);
    console.log('activity id is ' + useractivity);
    
    activityProgress(email, useractivity, function (err, activityDetail, Notes) {
        console.log('Activity detail is ' + activityDetail);
        console.log('Notes should include comments here ' + Notes);
        console.log('Checking Notes.commentss separately ' + Notes.commentss);
//        res.redirect('/');
        res.render('activityprogress', { activityDetail: activityDetail, notes: Notes });
    });
    
    function activityProgress(userEmail, useractivity, callback) {
        
        models.Activity.findById(useractivity, function (err, activityDetail) {
            notes.Note.find({ authorId: userEmail, activityId: useractivity}).lean().exec(function(err, notes){
//            notes.Note.find({ authorId: userEmail, activityId: useractivity }, function (err, notes) {
                
                if (err) return callback(err, null, null);
                
                var addcomments = function (note, doneCallback) {
                    comments.Comment.find({ noteId : note._id }).lean().exec(function (err, postcomments){
//                    comments.Comment.find({ noteId : note._id }, function (err, postcomments) {
                        note.commentss = postcomments;

//                        note.set("commentss", postcomments, { strict: false });
                        console.log('note should include comments ' + note);
                        console.log('trying note.commentss ' + note.commentss);
                        return doneCallback(null, note);
                    });
                };
                async.map(notes, addcomments, function (err, noteswithcomments) {
                    callback(err, activityDetail, noteswithcomments);
                });
            })
        })
    }
});


//router.use('/activityprogress/:useractivity', require('./activityprogress.js'));
//router.use('/addnote', require('./addnote.js');
//router.use('/addcomment',require('./addcomment.js');

/**
 * router.use('/userActivity', ...) We should be able to see activity details, related posts and comments, and have links to add new posts and new comments.
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
router.use('/electronicspathways', require('./electronicspathways.js'));
router.use('/activities', require('./activities.js'));
//We also want to add a route to see details of a particular activity
//This could be added as a /permalink route from the /activities route above?

//BADGEKIT and BADGEKIT API ACCESS
router.use('/blist', require('./blist.js'));
router.use('/bdetail', require('./bdetail.js'));
router.use('/bapply', require('./bapply.js'));
router.use('/bsubmit', require('./bsubmit.js'));
router.use('/hook', require('./hook.js'));
router.use('/accept', require('./accept.js'));

// Any route that we haven't specified gets this message
router.get('*', function (req, res) {
    res.send("Page not found", 404);
});


module.exports = router;
