const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const gm = require('gm');
const encrypt = require('../models/encrypt.js');
const sd = require('silly-datetime');
const db = require('../models/db.js');



exports.index = (req, res, next) => {
  let { login, username = '' } = req.session;
  db.find('users', { username }, {}, (err, result) => {
    if (err) throw Error(err);
    const avatar = result[0] ? result[0].avatar || 'default.jpg' : 'default.jpg';
    res.render('index', {
      login,
      username,
      avatar
    })
  })
}

exports.register = (req, res, next) => {
  const { login, username } = req.session;
  res.render('register', {
    login,
    username
  });
}

exports.postRegister = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) throw Error(err);
    const { username, password } = fields;
    db.find('users', {
      username
    }, {}, (err, result) => {
      if (err) throw Error(err);
      if (result.length) {
        res.send({
          code: -1,
          message: '用户已经存在'
        });
      } else {
        db.insertOne('users',
          {
            username,
            password: encrypt(password),
            avatar: 'default.jpg'
          }, (err, result) => {
            if (result.result.n == 1 && result.result.ok == '1') {
              res.send({
                code: 1,
                message: '注册成功'
              });
            }
          })
      }
    })
  });
}

exports.login = (req, res, next) => {
  const { login, username } = req.session;
  res.render('login', {
    login,
    username
  });
}

exports.postLogin = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) throw Error(err);
    const { username, password } = fields;
    db.find('users', { username }, {}, (err, result) => {
      if (!result.length) {
        res.send({
          code: -1,
          message: '用户不存在'
        });
      } else {
        if (result[0].password !== encrypt(password)) {
          res.send({
            code: -1,
            message: '密码错误'
          });
        } else {
          req.session.login = true;
          req.session.username = username;
          res.send({
            code: 1,
            message: '登录成功'
          });
        }
      }
    })
  });
}

exports.avatar = (req, res, next) => {
  const { login, username } = req.session;
  res.render('avatar', {
    login,
    username
  });
}

exports.postAvatar = (req, res) => {
  const { login, username } = req.session;
  if (!login) {
    res.send('请先登录');
    return;
  }
  const form = new formidable.IncomingForm();
  form.uploadDir = path.normalize(path.__dirname + '/../avatar');
  form.parse(req, (err, fields, files, next) => {
    if (err) throw Error(err);
    const time = sd.format(new Date(), 'YYYYMMDDHHmmss');
    const ran = parseInt(Math.random() * 89999 + 10000);
    const extname = path.extname(files.picture.name);
    const newPath = path.normalize(__dirname + '/../avatar/' + '/' + username + extname)
    const oldPath = files.picture.path;
    fs.rename(oldPath, newPath, (err) => {
      if (err) throw Error(err);
      req.session.avatar = username + extname;
      res.redirect('/cut');
    })
  });
}

exports.cut = (req, res, next) => {
  const { username, login, avatar } = req.session;
  res.render('cut', {
    username,
    login,
    avatar
  });
}
exports.postCut = (req, res, next) => {
  const { username, avatar } = req.session;
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    const { x, y, w, h } = fields;
    gm('./avatar/' + avatar)
      .crop(w, h, x, y)
      .resize(100, 100, "!")
      .write('./avatar/' + avatar, (err) => {
        if (err) throw Error(err);
        db.updateMany('users', { username }, { $set: { avatar } }, (err, result) => {
          if (err) throw Error(err);
          if (result.result.n == 1 && result.result.ok == 1 && result.result.nModified == 1) {
            res.send({
              code: 1,
              message: '裁剪成功'
            })
          } else {
            res.send({
              code: -1,
              message: '裁剪失败，请重试'
            })
          }
        })
      })
  })
}

exports.publish = (req, res, next) => {
  const { page } = req.query;
  db.find('posts', {}, { pageAmount: 10, page, sort: { dateTime: -1 } }, (err, posts = []) => {
    if (err) throw Error(err);
    res.json({
      code: '1',
      posts
    });
  })
}

exports.postPublish = (req, res, next) => {
  const { username } = req.session;
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    const { content } = fields;
    db.insertOne('posts', {
      username,
      content,
      dateTime: new Date()
    }, (err, result) => {
      if (err) throw Error(err);
      if (result.result.n == 1 && result.result.ok == '1') {
        res.send({
          code: 1,
          message: '发表成功'
        });
      } else {
        res.send({
          code: -1,
          message: '发表失败'
        });
      }
    })
  });
}


exports.getUserInfo = (req, res, next) => {
  const { username } = req.query;
  db.find('users', { username }, {}, (err, result) => {
    if (err) throw Error(err);
    res.json({
      code: '1',
      ...result
    })
  })
}

exports.getPostsCount = (req, res, next) => {
  db.getAllCount('posts', (err, result) => {
    if (err) throw Error(err);
    res.json(result);
  });
}

exports.getAllUser = (req, res, next) => {
  const { login, username } = req.session;
  if (!login) {
    res.send('请先登录');
    return;
  }
  db.find('users', {}, {}, (err, result) => {
    if (err) throw Error(err);
    res.render('users', {
      users: result,
      login,
      username
    });
  })
}

exports.getPostsByUser = (req, res, next) => {
  const { login, username } = req.session;
  if (!login) {
    res.send('请先登录');
    return;
  }
  const { user } = req.params;
  db.find('posts', { username: user }, {}, (err, result) => {
    if (err) throw Error(err);
    db.find('users', { username: user }, {}, (err, result2) => {
      if (err) throw Error(err);
      res.render('user', {
        posts: result,
        login,
        username,
        user,
        avatar: result2[0].avatar
      });
    })
  })
}

exports.logout = (req, res, next) => {
  req.session.login = false;
  req.session.username = null;
  req.session.avatar = null;
  const { username, login, avatar, posts } = req.session;
  res.render('index', {
    username,
    login,
    avatar,
    posts
  });
}
