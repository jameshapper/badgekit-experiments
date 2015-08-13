var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Our Post model.
 *
 * This is how we create, edit, delete, and retrieve posts via MongoDB.
 */
module.exports.Post = mongoose.model('posts', new Schema({
  authorId:    { type: String, required: '{PATH} is required.' },
  title:     { type: String, required: '{PATH} is required.', unique: true },
  body:        { type: String, required: '{PATH} is required.' },
}));
