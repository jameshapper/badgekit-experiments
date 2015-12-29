var users = require('./models/users');
var utils = require('./utils');

/**
 * A simple authentication middleware for Express.
 *
 * This middleware will load users from session data, and handle all user
 * proxying for convenience.
 * From https://stormpath.com/blog/everything-you-ever-wanted-to-know-about-node-dot-js-sessions/
 */
module.exports.simpleAuth = function(req, res, next) {
  if (req.session && req.session.user) {
    users.User.findOne({ email: req.session.user.email }, 'firstName lastName email data', function(err, user) {
      if (user) {
        utils.createUserSession(req, res, user);
      }
      next();
    });
  } else {
    next();
  }
};
