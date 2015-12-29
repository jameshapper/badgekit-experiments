var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

/**
 * Our User model.
 *
 * This is how we create, edit, delete, and retrieve user accounts via MongoDB.
 */
module.exports.User = mongoose.model('User', new Schema({
  id:           { type: ObjectId },
  firstName:    { type: String, required: '{PATH} is required.' },
  lastName:     { type: String, required: '{PATH} is required.' },
  email:        { type: String, required: '{PATH} is required.', unique: true },
  password:     { type: String, required: '{PATH} is required.' },
  school:       { type: String},
    activities: { type: Array, default: [] },
    activitiesTEST: [{ type: ObjectId, ref: 'Act' }],
  badges:       { type: Array, default: []},
  data:         Object,
}));
