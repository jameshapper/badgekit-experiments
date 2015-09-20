var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Our Comment model.
 *
 * This is how we create, edit, delete, and retrieve comments via MongoDB.
 */
module.exports.Comment = mongoose.model('comments', new Schema({
    body: String,
    author: String,
    noteId: mongoose.Schema.Types.ObjectId
}));
