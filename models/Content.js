var mongoose = require('mongoose');
var ContentSchema = require('../schemas/content');

module.exports = mongoose.model('Content', ContentSchema);