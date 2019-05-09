const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  name: { type: String },
  author: { type: String },
  price: { type: Number },
  // type: { type: Array }
})
