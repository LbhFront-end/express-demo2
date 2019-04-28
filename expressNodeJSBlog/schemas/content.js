var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  title: String,
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  // 关联字段 -用户id
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  views: {
    type: Number,
    default: 0
  },
  addTime: {
    type: Date,
    default: new Date()
  },
  comments: {
    type: Array,
    default: []
  }
});