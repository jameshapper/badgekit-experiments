// JavaScript source code
var bcrypt = require('bcryptjs');
var express = require('express');
var utils = require('../../utils.js');
var models = require('../../models/comments.js');

//DATABASE ACCESS
//   Comments collection


var router = express.Router();

/**
 * render the add comment page.
 */

router.get('/', function (req, res) {
    res.render('addcomment.jade', { csrfToken: req.csrfToken() });
});

/**
 * Create a new comment
 *
 * Once submitted, user will be returned to add another activity
 */

router.post('/', function (req, res) {

    var comment = new models.Comment({
        author: req.body.commentAuthor,
        body: req.body.commentBody,
        noteId: req.body.commentNoteId,
    });
    comment.save(function (err) {
        if (err) {
            var error = 'Something bad happened! Please try again.';

            res.render('addcomment.jade', { error: error });
        } else {
            res.redirect('/useractvityview');
        }
    });
});

module.exports = router;

