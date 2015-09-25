//Electonics Pathways
var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('electronicspathways.jade', {});
});

module.exports = router;