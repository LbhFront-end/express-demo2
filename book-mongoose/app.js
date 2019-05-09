const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use('/', require('./router/index'))

mongoose.connect('mongodb://localhost:27017/book', { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log('数据库连接失败：' + err);
  } else {
    console.log('数据库成功连接');
    app.listen(8081);
  }
});



