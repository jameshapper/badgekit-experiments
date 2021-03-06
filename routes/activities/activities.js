// JavaScript source code
var bcrypt = require('bcryptjs');
var express = require('express');
var utils = require('../../utils.js');
var models = require('../../models/activity.js');

//DATABASE ACCESS
//   Activities collection ONLY



var router = express.Router();

/**firstName
 * Render the activity registration page.
 */
router.get('/new', function (req, res) {
    res.render('activityregister.jade', { title: 'ADD NEW ACTIVITY INFORMATION', csrfToken: req.csrfToken() });
});

/**
 * Create a new activity
 *
 * Once submitted, admin user will be returned to register another activity
 */
router.post('/', function (req, res) {

    var activity = new models.Activity({
        activityName: req.body.activityName,
        activityUrl: req.body.activityUrl,
        activityStrapline: req.body.activityStrapline,
        criteria: req.body.criteria,
    });
    activity.save(function (err) {
        if (err) {
            var error = 'Something bad happened! Please try again.';
            console.log(err);

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
//            console.log(activitiesList);
        }
    });
});

router.get('/:activityid', function (req, res) {
    var activityid = req.params.activityid;
    models.Activity.findById(activityid, function (err, activitydetail) {
        res.render('activitydetail.jade', { title: 'ACTIVITY DETAIL', subtitle: 'Details', activity : activitydetail });
    })
});


router.get('/:activityid/edit', function (req, res) {
    var activityid = req.params.activityid;
    models.Activity.findById(activityid, function (err, activity) {
        res.render('activityedit.jade', { title: 'EDIT ACTIVITY', subtitle: 'Details', activity : activity, csrfToken: req.csrfToken() });
    })
})


router.put('/:activityid', function (req, res) {
    var activityid = req.params.activityid;
    var activityName = req.body.activityName;
    var activityUrl = req.body.activityUrl;
    var activityStrapline = req.body.activityStrapline;
    models.Activity.update({ _id : activityid }, { $set: {activityName : activityName, activityUrl : activityUrl, activityStrapline : activityStrapline} }, function (err, idunno) {
        res.redirect(activityid);
    })
})


module.exports = router;

