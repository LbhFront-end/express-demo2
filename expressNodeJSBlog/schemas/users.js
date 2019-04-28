// 定义数据库存储结构(数据库字段和类型)
var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
  username: String,
  password: String,
  isAdmin: {
    type: Boolean,
    default: false
  }
})