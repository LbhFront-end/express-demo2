var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Cookies = require('cookies');
var User = require('./models/User');

// 创建 app 引用,相当于 nodeJS 的 http.createService()
var app = express();

//配置应用模板
// 定义当前应用所使用的模板引擎，第一个参数：模板引擎名称，同时也是模板文件的后缀；第二个参数：解析模板内容的方法
app.engine('html', swig.renderFile);
// 设置模板文件存放的目录，第一个参数必须是 views，第二个参数是目录
app.set('views', './views');
// 注册模板，第一个参数：必须是view engine，第二个参数与定义模板引擎的第一个名称一样
app.set('view engine', 'html');
// 第一次读取会把模板缓存到内存中，下次会直接读取，因此即使改变了模板内容刷新也不会有变化，需要在开发过程中取消缓存
swig.setDefaults({ cache: false });

// 设置静态文件托管
// 托管规则：用户发送 http 请求到后端，后端解析 url,找到匹配规则，执行绑定函数，返回相对应的内容，静态文件直接读取目录下文件返回给用户。动态文件：处理逻辑，加载模块，解析模板返回数据
// 当用户请求的路径url 以 /public 开头时候，以第二个参数的方式进行处理（直接返回 __dirname + '/public' 目录下文件）
app.use('/public', express.static(__dirname + '/public'));
// bodyparser设置
app.use(bodyParser.urlencoded({ extended: true }));
// 设置 cookie
app.use(function (req, res, next) {
  // 调用 req 的 cookies 方法把 Cookies 加载到 req 对象里面
  req.cookies = new Cookies(req, res);
  // 定义一个全局访问对象
  req.userInfo = {};
  // 如果浏览器请求有 cookie 消息，尝试解析
  if (req.cookies.get('userInfo')) {
    try {
      req.userInfo = JSON.parse(req.cookies.get('userInfo'));
      // 获取当前用户登录的类型，是否为管理员
      User.findById(req.userInfo._id).then(function (userInfo) {
        req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
        next();
      });
    } catch (e) {
      console.log('出现错误:', e);
      next();
    }
  } else {
    next();
  }
});

// 根据不同的功能划分路由模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

// 使用 mongoose 的 connect 方法来连接数据库，第一个参数是数据库地址，第二个参数是连接状态返回函数
mongoose.connect('mongodb://localhost:27017/blog', function (err) {
  if (err) {
    console.log('数据库连接失败：' + err);
  } else {
    console.log('数据库链接成功');
    // 监听 http 请求
    app.listen(8081);
  }
});


/**
 * [description] 给app绑定首页路由，把一个url路径通过一个或者多个方法绑定
 * @param {[type]} req request对象，保存客户端请求相关的一些数据
 * @param {[type]} res response对象
 * @param {[type]} next 函数，用于执行下一个和当前路径匹配的函数
 * @param {[type]} [description]
*/
// app.get('/', function (req, res, next) {
//   // res.send(string) 发送内容到客户端
//   // res.send('<h1>欢迎来到我的博客</h1>');
//   // 读取views 目录下的指定文件，解析并返回客户端，第一个参数：模板的文件相对于 views/index.html
//   // 第二个参数：传递给模板使用的数据
//   res.render('index');
// });

// 静态文件托管
// 这种写法不推荐，也不使用
// app.get('/styles/main.css', function (req, res, next) {
//   // 设置内容类型，默认以字符串方式访问
//   res.setHeader('content-type', 'text/css');
//   // 字符串形式的css 内容
//   res.send("body {color:red}");
// });


