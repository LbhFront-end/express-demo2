const mongoose = require('mongoose');
const BookSchema = require('../schemas/books');

BookSchema.statics.getBooks = function (callback) {
  this.model('Book').find({}, callback)
}
BookSchema.statics.addBook = function (fields, callback) {
  const { name = '' } = fields;
  const Book = this.model('Book');
  Book.findOne({ name }, (err, result) => {
    if (err) return callback({ code: -1, message: err }, null)
    if (!result) {
      Book.create(fields, (err) => {
        if (err) return callback({ code: -1, message: err }, null);
        callback({ code: 1, message: '创建成功' }, null)
      })
    } else {
      callback({ code: -1, message: '书名已经存在' }, null)
    }
  })
}
BookSchema.statics.getBook = function (_id, callback) {
  this.model('Book').find({ _id }, callback);
}
BookSchema.statics.editBook = function (fields, callback) {
  const { id, ...restProps } = fields;
  this.model('Book').updateOne({ _id: id }, { $set: { ...restProps } }, callback);
}
BookSchema.statics.deleteBook = function (_id, callback) {
  this.model('Book').remove({ _id }, callback)
}
module.exports = mongoose.model('Book', BookSchema)
