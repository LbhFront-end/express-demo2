// 创建一个 User 的模型类
// 实际是通过操作模型类来对数据库进行操作
var mongoose = require('mongoose');
var usersSchema = require('../schemas/users');

// mongoose 的模型方法创建 User 模型，操作 usersSchema，并暴露出去
module.exports = mongoose.model('User', usersSchema);