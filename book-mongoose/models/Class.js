const mongoose = require('mongoose');
const ClassSchema = require('../schemas/classes');

module.exports = mongoose.model('Class', ClassSchema);