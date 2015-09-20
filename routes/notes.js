// JavaScript source code
var bcrypt = require('bcryptjs');
var express = require('express');
var utils = require('../utils.js');
var notes = require('../models/notes.js');
var router = express.Router();

/**
 * Render the posts/notes registration page.
 Reach here from the following views:
 --
 */
router.get('/new', function (req, res) {
    res.render('addnote.jade', { csrfToken: req.csrfToken() });
});

/**
 * Create a new note
 *
 * Once submitted, admin user will be returned to register another note
 */
router.post('/', function (req, res) {

    var note = new notes.Note({
        title: req.body.title,
        authorId: req.user._id,
        body: req.body.body
    });
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


router.get('/:noteid', function (req, res) {
    var noteid = req.params.noteid;
    models.Note.findById(noteid, function (err, note) {
        res.render('note.jade', { title: 'NOTE DETAIL', subtitle: 'Details', note: note });
    })
});


router.get('/:noteid/edit', function (req, res) {
    var noteid = req.params.noteid;
    models.Note.findById(noteid, function (err, note) {
        res.render('noteedit.jade', { title: 'EDIT NOTE', subtitle: 'Details', note: note, csrfToken: req.csrfToken() });
    })
})


router.put('/:noteid', function (req, res) {
    var noteid = req.params.noteid;
    var title = req.body.title;
    var body = req.body.body;
    models.Note.update({ _id: noteid }, { $set: { body: body, title: title } }, function (err, idunno) {
        res.redirect(noteid);
    })
})

module.exports = router;

