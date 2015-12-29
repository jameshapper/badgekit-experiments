// JavaScript source code
var bcrypt = require('bcryptjs');
var express = require('express');
var utils = require('../../utils.js');
var notes = require('../../models/notes.js');
var comments = require('../../models/comments.js');
var router = express.Router();
var util = require('util');

//DATABASE ACCESS
//   Notes collection


/**
 * Render the posts/notes registration page.
 Reach here from the following views:
 --
 */
router.get('/new', function (req, res) {
    var activityId = req.query.activityId;
    res.render('addnote.jade', { csrfToken: req.csrfToken(), activityId: activityId });
});

/**
 * Create a new note
 *
 * Once submitted, admin user will be returned to register another note
 */
router.post('/', function (req, res) {

    var note = new notes.Note( {
        title: req.body.title,
        authorId: req.user.email,
        body: req.body.body,
        activityId: req.body.activityId
    });
    
    console.log("req object is " + req.body);
    console.log("req object is " + util.inspect(req.body, false, null));

    note.save(function (err) {
        if (err) {
            var error = 'Something bad happened! Please try again.';

            if (err.code === 11000) {
                error = 'That activity name is already taken, please try another.';
            }
            console.log(err);
            res.render('addnote.jade', { error: error });
        } else {
            res.redirect('/dashboard');
        }
    });
});

// list all notes

/*
router.get('/', function (req, res) {
    models.Note.find({}).exec(function (err, notes) {
        //    models.Activity.find({}, { _id:0, "criteria": 1 }).exec(function (err, activitiesList) {

        if (err) {
            console.log("db error in GET /activities: " + err);
            //res.render('500');
        } else {
            res.render('allnotes.jade', { title: 'ALL NOTES', subtitle: 'Current List', notes: notes, csrfToken: req.csrfToken() });
        }
    });
});
*/
/**
 * render the add comment page.
 */

router.get('/addcomment', function (req, res) {
    var noteId = req.query.noteId;
    res.render('addcomment.jade', { csrfToken: req.csrfToken(), noteId: noteId });
});

/**
 * Create a new comment
 *
 * Once submitted, user will be returned to add another activity
 */

router.post('/addcomment', function (req, res) {
    
    var comment = new comments.Comment({
        author: req.body.commentAuthor,
        body: req.body.commentBody,
        noteId: req.body.noteId,
    });
    var noteId = req.body.noteId;
    var commentBody = req.body.commentBody;

    comment.save(function (err) {
        if (err) {
            var error = 'Something bad happened! Please try again.';
            
            res.render('addcomment.jade', { error: error });
        } else {
            comments.Comment.findOne({ body: commentBody }, { _id: 1 }).exec(function (err, commentId) {
                notes.Note.update({ _id: noteId }, { $push: { comments: commentId } }).exec(function (err, updated) {
                    res.redirect(noteId);
                })
            })
        }
    })
});

router.get('/:noteid', function (req, res) {
    var noteid = req.params.noteid;
    notes.Note.findById(noteid).populate('comments').exec(function (err, note) {
        res.render('note.jade', { title: 'NOTE DETAIL', subtitle: 'Details', note: note });
    })
});


router.get('/:noteid/edit', function (req, res) {
    var noteid = req.params.noteid;
    notes.Note.findById(noteid, function (err, note) {
        res.render('noteedit.jade', { title: 'EDIT NOTE', subtitle: 'Details', note: note, csrfToken: req.csrfToken() });
    })
})


router.put('/:noteid', function (req, res) {
    var noteid = req.params.noteid;
    var title = req.body.title;
    var body = req.body.body;
    notes.Note.update({ _id: noteid }, { $set: { body: body, title: title } }, function (err, idunno) {
        res.redirect(noteid);
    })
})



module.exports = router;

