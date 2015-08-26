// JavaScript source code

var express = require("express");
var router = express.Router();
var utils = require('../utils.js');
var models = require('../models/activity.js');
var user = require('../models.js');
//var mongoose = require("mongoose");
var bodyParser = require('body-parser');
//app.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/', utils.requireLogin, function (req, res) {
    var activity_id = req.body.activity;
    console.log('activity id is ' + activity_id);
    var email = req.user.email;
    var query = { 'email': email };
    var operator = { '$push' : { activities: activity_id } };
    user.User.update(query, operator, function (err, updated) {
        if (err) throw err;
        else {
            console.log("Added a new activity");
            res.render('dashboard', { user: req.user });
        }
    })
});

module.exports = router;