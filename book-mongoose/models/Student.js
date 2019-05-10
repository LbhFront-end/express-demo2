const mongoose = require('mongoose');
const StudentSchema = require('../schemas/students');

module.exports = mongoose.model('Student', StudentSchema)


StudentSchema.statics.getStudent = (json) => {
  return this.model('Student').findOne(json, (err, result) => new Promise((resolve, reject) => {
    if (err) reject(err)
    resolve(result)
  }))
}