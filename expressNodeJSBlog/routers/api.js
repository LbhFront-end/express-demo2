var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Content = require('../models/Content');

// 定义返回变量格式
var resData;
router.use(function (req, res, next) {
  resData = {
    code: 0,
    message: ''
  };
  next();
});
// 用户注册
router.post('/user/register', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var repassword = req.body.repassword;
  if (username === '') {
    resData.code = 1;
    resData.message = '用户名不能为空';
    res.json(resData);
    return;
  }
  if (password === '') {
    resData.code = 2;
    resData.message = '密码不能为空';
    res.json(resData);
    return;
  }
  if (repassword !== password) {
    resData.code = 3;
    resData.message = '两次输入的密码不一致';
    res.json(resData);
    return;
  }
  User.findOne({
    username: username
  }).then(function (userInfo) {
    // 若控制台返回空表表示没有查到数据
    console.log(userInfo);
    if (userInfo) {
      // 若数据库中有该数据
      resData.code = 4;
      resData.message = '用户名已经被注册';
      res.json(resData);
      return
    }
    // 若用户名没有被注册则将用户保存在数据库中
    var user = new User({
      username: username,
      password: password
    });
    return user.save();
  }).then(function (newUserInfo) {
    console.log(newUserInfo);
    resData.message = '注册成功';
    res.json(resData);
  });
});

// 用户登录
router.post('/user/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  if (username == '' || password == '') {
    resData.code = 1;
    resData.message = '用户名或者密码不能为空';
    res.json(resData);
    return;
  }
  // 查询数据库验证用户名和密码
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      resData.code = 2;
      resData.message = '用户名或者密码错误';
      res.json(resData);
      return;
    }
    // 验证通过则登录
    resData.message = '登录成功';
    resData.userInfo = {
      _id: userInfo._id,
      username: userInfo.username
    };
    // 使用 req.cookies 的 set 方法把用户信息发送cookie 信息给浏览器保存，在此登录浏览器会将cookies 信息放在头部发送给服务端，服务端验证登录状态
    req.cookies.set('userInfo', JSON.stringify({
      _id: userInfo._id,
      username: userInfo.username
    }));
    res.json(resData);
    return;
  });
});

// 用户登出
router.get('/user/logout', function (req, res, next) {
  req.cookies.set('userInfo', null);
  res.json(resData);
});

// 评论提交
router.post('/comment/post', function (req, res) {
  //内容的id
  var contentid = req.body.contentid || '';
  console.log('id：' + contentid);
  var postData = {
    username: req.userInfo.username,
    postTime: new Date(),
    content: req.body.content
  }
  //查询当前这边内容的信息
  Content.findOne({
    _id: contentid
  }).then(function (content) {
    content.comments.push(postData);
    return content.save();
  }).then(function (newContent) {
    resData.message = '评论成功';
    resData.data = newContent,
      res.json(resData);
  });
})

// 获取指定文章的所有评论
router.get('/comment', function (req, res) {
  var contentid = req.query.contentid || '';
  Content.findOne({
    _id: contentid
  }).then(function (content) {
    resData.data = content.comments,
      res.json(resData);
  });
});


module.exports = router;

