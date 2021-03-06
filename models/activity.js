 var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**
 * Our Activity model.
 *
 * This is how we create, edit, delete, and retrieve activity information via MongoDB.
 * The number of activity criteria is variable, so criteria are stored in data.
 */
module.exports.Activity = mongoose.model('Activity', new Schema({
    //  _id: { type: String },
  _id: { type: ObjectId },
  activityName: { type: String, required: '{PATH} is required.', unique: true },
  activityUrl: { type: String, required: '{PATH} is required.' },
  activityStrapline:     { type: String, required: '{PATH} is required.' },
  criteria: { type: Array },
}));
