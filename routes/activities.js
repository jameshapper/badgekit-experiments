// JavaScript source code
var bcrypt = require('bcryptjs');
var express = require('express');
var utils = require('../utils.js');
var models = require('../models/activity.js');


var router = express.Router();

/**firstName
 * Render the activity registration page.
 */
router.get('/activityregister', function (req, res) {
    res.render('activityregister.jade', { csrfToken: req.csrfToken() });
});

/**
 * Create a new activity
 *
 * Once submitted, admin user will be returned to register another activity
 */
router.post('/activityregister', function (req, res) {

    var activity = new models.Activity({
        activityName: req.body.activityName,
        activityUrl: req.body.activityUrl,
        activityStrapline: req.body.activityStrapline,
        criteria: req.body.criteria,
    });
    activity.save(function (err) {
        if (err) {
            var error = 'Something bad happened! Please try again.';

            if (err.code === 11000) {
                error = 'That activity name is already taken, please try another.';
            }

            res.render('activityregister.jade', { error: error });
        } else {
            res.redirect('/dashboard');
        }
    });
});

// list all activities

router.get('/', function (req, res) {
    models.Activity.find({}).exec(function (err, activitiesList) {
//    models.Activity.find({}, { _id:0, "criteria": 1 }).exec(function (err, activitiesList) {

        if (err) {
            console.log("db error in GET /activities: " + err);
            //res.render('500');
        } else {
            res.render('alist.jade', { title: 'ACTIVITIES', subtitle: 'Current List', activities: activitiesList, csrfToken: req.csrfToken()});
            console.log(activitiesList);
        }
    });
});

module.exports = router;

