// JavaScript source code
//VERSION 1


router.get('/activityprogress/:useractivity', utils.requireLogin, function (req, res) {

    //this route should be accessed by the user dashboard and include "useractivity" as a parameter
    //in the url

    var email = req.user.email;
    var useractivity = req.params.useractivity;
    req.activityId = useractivity;

    console.log('email is ' + email);
    console.log('activity id is ' + useractivity);
    /*
    notes.Note.find({ authorId: email, activityId : "55d043414e3bade77a2e2804" }, function (err, notescursor) {
        console.log('notescursor is ' + notescursor);
    })
    */

    /*
    notes.Note.find(function (err, notescursor) {
        console.log('notescursor is ' + notescursor);
        if (notescursor instanceof Array) {
            console.log('notescursor is an array');
        }
        console.log(typeof notescursor);
        console.log('the first element of notescursor is ' + notescursor[0]);
        res.redirect('/');
    })
     */


    activityProgress(email, useractivity, function (err, activityDetail, Notes) {
        console.log('Activity detail is ' + activityDetail);
        console.log('Notes should include comments here ' + Notes);
        res.redirect('/');
        //        res.render('activityprogress', { user: req.user, activity: activityDetail, notes: Notes });
    });

    function activityProgress(userEmail, useractivity, callback) {
        //effectively, I'm demanding to find activity details (criteria) before looking for posts and comments, even though these
        //could really be done in parallel--otherwise, I don't know how to ensure that they both complete before the view

        models.Activity.findById(useractivity, function (err, activityDetail) {
            notes.Note.find({ authorId: userEmail, activityId: useractivity }, function (err, notes) {
                "use strict";
                if (err) return callback(err, null, null);

                var notesCount = 0; //need this to deal with asynchronous loop that follows

                for (var i = 0; i < notes.length; i++) {
                    console.log('at first, i has value: ' + i);
                    comments.Comment.find({ noteId: notes[i]._id }, function (err, postcomments) {
                        console.log('notes[i] should be a post object: ', notes[i]);
                        console.log('but asynchronous calls means that i has value: ' + i);
                        console.log('notes.length is: ' + notes.length);
                        //                        notes[i].comments = [];
                        //                        notes[i].comments.push(postcomments);
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

//VERSION 2

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
        res.redirect('/');
        //        res.render('activityprogress', { user: req.user, activity: activityDetail, notes: Notes });
    });

    function activityProgress(userEmail, useractivity, callback) {

        models.Activity.findById(useractivity, function (err, activityDetail) {
            notes.Note.find({ authorId: userEmail, activityId: useractivity }, function (err, notes) {
                "use strict";
                if (err) return callback(err, null, null);
                 
                var addcomments = function(note, doneCallback) {
                     comments.Comment.find({noteId : note._id }, function (err, postcomments) {
                        note.comments = postcomments;
                        return doneCallback(null, note);
                     });
                };
                async.map(notes, addcomments, function(err, noteswithcomments) {
                        callback (err, ActivityDetail, noteswithcomments);
                });
            })
        })
    }
});
