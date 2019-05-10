const mongoose = require('mongoose');
const StudentSchema = require('../schemas/students');
module.exports = new mongoose.Schema({
  name: { type: String },
  time: { type: Date, default: new Date() },
  students: [StudentSchema]
})