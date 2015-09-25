var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


/**
 * Our Note model.
 *
 * This is how we create, edit, delete, and retrieve notes via MongoDB.
 */
module.exports.Note = mongoose.model('Note', new Schema({
  id: { type: ObjectId },
  authorId: { type: String, required: '{PATH} is required.' },
//  authorId: { type: ObjectId, ref: 'User' },
  activityId: mongoose.Schema.Types.ObjectId,
//  activityId: { type: String },
  title:     { type: String, required: '{PATH} is required.', unique: true },
  body: { type: String, required: '{PATH} is required.' },
  comments: [{type: ObjectId, ref: 'comments'}]
}));
