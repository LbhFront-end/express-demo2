const express = require('express');
const formidable = require('formidable');
const ObjectId = require('mongodb').ObjectID;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const gm = require('gm');
const db = require('./model/db.js');
const encrypt = require('./model/encrypt.js');
const app = express();

app.set("view engine", "ejs");
app.use(express.static('./public'))
app.use(cookieParser());
app.use(session({
  secret: 'haha',
  resave: true,
  saveUninitialized: true,
  // cookie: {
  //   secure: true
  // }
}))

app.get("/", (req, res, next) => {
  db.getAllCount('guestbook', (err, result) => {
    if (err) throw Error(err);
    res.cookie('Name', 'HaHa', { maxAge: 90000, httpOnly: true });
    res.render('index', {
      count: Math.ceil(result / 4)
    });
  });
});

app.get('/list', (req, res, next) => {
  const page = parseInt(req.query.page);
  db.find('guestbook', {}, { sort: { time: -1 }, page, pageAmount: 4 }, (err, result) => {
    if (err) {
      res.json({ code: '-1', list: result })
      return;
    }
    res.json({ code: '1', list: result })
    // res.render('index', {
    //   list: result
    // })
  })
  // next();
})

app.post('/submit', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) throw Error(err);
    db.insertOne('guestbook', {
      ...fields,
      time: new Date()
    }, (err, result) => {
      if (err) {
        res.json({ code: '-1', result: '提交失败' })
        return;
      }
      res.json({ code: '1', result: '提交成功' })
    })
  })
});

app.get('/getCount', (req, res, next) => {
  db.getAllCount('guestbook', (err, result) => {
    if (err) throw Error(err);
    res.json(result);
  });
});

app.get('/delete', (req, res, next) => {
  const { id } = req.query;
  db.deleteMany('guestbook', { _id: ObjectId(id) }, (err, result) => {
    if (err) throw Error(err);
    res.redirect('/')
  })
})
app.get('/login', (req, res, next) => {
  res.render('login')
})
app.post('/login', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) throw Error(err);
    const { username, password } = fields;
    db.find('user', { username }, {}, (err, result) => {
      if (!result.length) {
        return res.send('账号不存在');
      } else {
        if (result[0].password !== encrypt(password)) {
          return res.send('密码错误');
        } else {
          req.session.login = true;
          req.session.username = username;
          res.send('登录成功');
        }
      }
    });
  });
})

app.get('/resigter', (req, res, next) => {
  res.render('resigter')
})
app.post('/resigter', (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) throw Error(err);
    const { username, password } = fields;
    db.find('user', { username }, {}, (err, result) => {
      if (!result.length) {
        db.insertOne('user', { username, password: encrypt(password) }, (err, result) => {
          if (err) throw Error(err);
          res.send('注册成功');
        })
      } else {
        res.send('用户已存在');
      }
    });
  });
})

app.get('/testLogin', (req, res, next) => {
  if (req.session.login) {
    res.send('欢迎你' + req.session.username);
  } else {
    res.send('请登陆');
  }
});
app.listen(3000);

// 处理图片 https://www.npmjs.com/package/gm
// 缩略图
gm('./public/images/folder.jpg')
  .resize(50, 50)
  .write('./public/images/folder-small.jpg', (err) => {
    if (err) throw Error(err);
    console.log('done');
  })
// 裁剪图
// .crop(w,h,x,y)
// app.get('/', (req, res) => {
//   db.insertOne('resturants', {
//     name: 'haha1',
//     age: parseInt(Math.random() * 100 + 10)
//   }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

// app.get('/student', (req, res) => {
//   const { page } = req.query;
//   db.find('resturants', {}, { pageAmount: 10, page: parseInt(page) }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

// app.get('/delete', (req, res) => {
//   const age = parseInt(req.query.age);
//   db.deleteMany('resturants', { age }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

// app.get('/modify', (req, res) => {
//   const age = parseInt(req.query.age);
//   db.updateMany('resturants', { age }, {
//     $set: {
//       work: 'frontend'
//     }
//   }, (err, result) => {
//     if (err) throw Error(err);
//     res.send(result);
//   })
// })

