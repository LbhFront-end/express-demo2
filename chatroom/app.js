const express = require('express')
const session = require('express-session');
const app = express();

const http = require('http').Server(app)
const io = require('socket.io')(http);
app.use(express.static('./public'))
app.use(session({
  secret: 'chatroom',
  resave: true,
  saveUninitialized: true
}))
app.set('view engine', 'ejs');

const allUser = [];

app.get('/', (req, res, next) => {
  res.render('index')
});
app.get('/check', (req, res, next) => {
  const { username } = req.query
  if (!username) {
    return res.send('必须输入昵称，请刷新重新登录');
  }
  if (allUser.indexOf(username) != -1) {
    return res.send('用户名已经被占用，请刷新重新输入');
  }
  allUser.push(username);
  req.session.username = username;
  res.redirect('/chat')
});

app.get('/chat', (req, res, next) => {
  const { username } = req.session
  if (!username) {
    return res.redirect('/')
  }
  res.render('chat', {
    username
  });
})
io.on('connection', (socket) => {
  socket.on('chat', msg => {
    io.emit('chatlist', msg);
  })
})
// io.on('connection', (socket) => {
//   console.log('1个客户端连接了')
//   socket.on('question', msg => {
//     // console.log('服务器得到了一个提问:' + msg)
//     io.emit('answer', msg);
//   })
// })
http.listen(3000);