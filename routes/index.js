var express = require('express');
var router = express.Router();

//HOME PAGE
router.get('/', function (req, res) {
    res.send('Stem Artisans Home Page');
});

//ABOUT US PAGE
router.get('/about', function (req, res) {
    res.send('About Stem Artisans');
});

router.use('/blist', require('./blist.js'));
router.use('/bdetail', require('./bdetail.js'));
router.use('/bapply', require('./bapply.js'));
router.use('/bsubmit', require('./bsubmit.js'));
router.use('/hook', require('./hook.js'));
//router.use('/accept', require('./accept.js'));
router.use('/accept', require('./hook.js'));

module.exports = router;
