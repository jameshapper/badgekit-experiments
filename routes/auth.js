var bcrypt = require('bcryptjs');
var express = require('express');
var utils = require('../utils.js');
var models = require('../models.js');
 

var router = express.Router();

/**
 * Render the registration page.
 */
router.get('/register', function(req, res) {
  res.render('register.jade', { csrfToken: req.csrfToken() });
});

/**
 * Create a new user account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/register', function(req, res) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(req.body.password, salt);
  var datatest = {
        badges: [
            {
                badgeName: 'badgename',
                badgeSlug: "the url with badge details",
                earnerDescription: "from badgekit",
                criteria: [
                    {
                        description: "from badgekit",
                        comments: [ 
                            {
                                comment: 'a comment regarding progress on this criterion',
                                fileurl: 'a url for associated file',
                                timepost: 'time this comment was posted'
                            }
                        ]
                    }
                ]
            }
        ]
    }

  var user = new models.User({
    firstName:  req.body.firstName,
    lastName:   req.body.lastName,
    email:      req.body.email,
    password:   hash,
    data: datatest,
  });
  user.save(function(err) {
    if (err) {
      var error = 'Something bad happened! Please try again.';

      if (err.code === 11000) {
        error = 'That email is already taken, please try another.';
      }

      res.render('register.jade', { error: error });
    } else {
      utils.createUserSession(req, res, user);
      res.redirect('/dashboard');
    }
  });
});

/**
 * Render the login page.
 */
router.get('/login', function(req, res) {
  res.render('login.jade', { csrfToken: req.csrfToken() });
});

/**
 * Log a user into their account.
 *
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/login', function(req, res) {
  models.User.findOne({ email: req.body.email }, 'firstName lastName email password data', function(err, user) {
    if (!user) {
      res.render('login.jade', { error: "Incorrect email / password." });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        utils.createUserSession(req, res, user);
        res.redirect('/dashboard');
      } else {
        res.render('login.jade', { error: "Incorrect email / password."  });
      }
    }
  });
});

/**
 * Log a user out of their account, then redirect them to the home page.
 */
router.get('/logout', function(req, res) {
  if (req.session) {
    req.session.reset();
  }
  res.redirect('/');
});

module.exports = router;