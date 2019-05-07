const express = require('express');
const session = require('express-session');
const router = require('./router/router.js');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static("./public"));
app.use("/avatar", express.static("./avatar"));
app.use(session({
  secret: 'talk',
  resave: true,
  saveUninitialized: true,
  // cookie: {
  //   secure: true
  // }
}));

app.get('/', router.index)
app.get('/register', router.register)
app.post('/register', router.postRegister)
app.get('/login', router.login)
app.post('/login', router.postLogin)
app.get('/avatar', router.avatar)
app.post('/avatar', router.postAvatar)
app.get('/cut', router.cut)
app.post('/cut', router.postCut)
app.get('/logout', router.logout)

app.listen(3000);