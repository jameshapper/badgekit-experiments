var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Our Comment model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
module.exports.Comment = mongoose.model('comments', new Schema({
    body: String,
    author: Number,
    postId: mongoose.Schema.Types.ObjectId
}));
