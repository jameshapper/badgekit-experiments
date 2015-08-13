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

/**
 * Render the dashboard page.
 */
router.get('/dashboard', utils.requireLogin, function (req, res) {
    res.render('dashboard.jade');
});

router.use('/blist', require('./blist.js'));
router.use('/bdetail', require('./bdetail.js'));
router.use('/bapply', require('./bapply.js'));
router.use('/bsubmit', require('./bsubmit.js'));
router.use('/hook', require('./hook.js'));
router.use('/accept', require('./accept.js'));
router.use('/electronicspathways', require('./electronicspathways.js'));
router.use('/auth', require('./auth.js'));
router.use('/select', require('./select.js'));
router.use('/activities', require('./activities.js'));

// Any route that we haven't specified gets this message
router.get('*', function (req, res) {
    res.send("Page not found", 404);
});


module.exports = router;
