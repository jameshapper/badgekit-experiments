// activityprogress.js
// Render the user's page of progress on current activities. Include activity criteria, posts, and 
// associated comments

var express = require("express");
var router = express.Router();
var utils = require('../../utils.js');
var models = require('../../models/activity.js');
var notes = require('../../models/notes.js');
var comments = require('../../models/comments.js');
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
var async = require('async');

router.get('/', utils.requireLogin, function (req, res) {
    
    //this route should be accessed by the user dashboard and include "useractivity" as a parameter
    //in the url
    

    
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
            notes.Note.find({ authorId: userEmail, activityId: useractivity }, function (err, notes) {
                
                if (err) return callback(err, null, null);
                
                var addcomments = function (note, doneCallback) {
                    comments.Comment.find({ noteId : note._id }, function (err, postcomments) {
                        //                        note.commentss = postcomments;
                        
                        note.set("commentss", postcomments, { strict: false });
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


/*
router.get('/', utils.requireLogin, function (req, res) {
    
    //this route should be accessed by the user dashboard and include "useractivity" as a parameter
    //in the url

    var email = req.user.email;
    var useractivity = req.params.useractivity;
    req.activityId = useractivity;

    console.log('email is ' + email);
    console.log('activity id is ' + useractivity);

    activityProgress(email, useractivity, function (err, activityDetail, Notes) {
        console.log('Activity detail is ' + activityDetail);
        console.log('Notes should include comments here ' + Notes);
        res.render('activityprogress', { user: req.user, activity: activityDetail, notes: Notes });
    });

    function activityProgress(userEmail, useractivity, callback) {
        //effectively, I'm demanding to find activity details (criteria) before looking for posts and comments, even though these
        //could really be done in parallel--otherwise, I don't know how to ensure that they both complete before the view

        models.Activity.findById(useractivity, function (err, activityDetail) {
            notes.Note.find({authorId: userEmail, activityId : useractivity}).toArray(function (err, notes) {
                "use strict";
                if (err) return callback(err, null, null);

                var notesCount = 0; //need this to deal with asynchronous loop that follows

                for (var i = 0; i < notes.length; i++) {
                    comments.Comment.find({noteId : notes[i].noteID}, function (err, postcomments) {
                        notes.comments = postcomments;
                        if (++notesCount == notes.length) {
                            callback(err, activityDetail, notes);
                        }
                    })
}
            })
        })

    }        
});
*/
module.exports = router;