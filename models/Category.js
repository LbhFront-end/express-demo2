var mongoose = require('mongoose');
var CategorySchema = require('../schemas/categories');

module.exports = mongoose.model('Category', CategorySchema);