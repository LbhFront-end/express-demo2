const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  sex: { type: Number }
})