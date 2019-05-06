## Guestbook

介绍：简单留言板

### 工具：

MongoDB + express + ejs

### 功能：

- 登录
- 测试登录状态
- 提交留言，读取 Mongodb 数据库留言列表渲染

### 笔记：

- cookie 是在 res 中设置的，在 req 中读取，第一次访问没有 cookie
- cookie 的存储大小有限，对用户可见，用户可以禁止，清除，可以篡改
- cookie 用来制作记录用户的一些信息，购买历史，猜你喜欢
- session 是利用 cookie 来实现的会话，第一次访问的时候，在服务器上为这个用户缓存一些信息，别的用户不能看见这个用户的信息。服务器会下发一个秘钥（cookie）。客户端每次访问都会携带这个秘钥，服务器如果发现这个秘钥温和，就能显示这个用户曾经保存的信息。
- 任何用户的 session 都是透明的，不会体现 cookie 机理
-  安装 gm 以后调用的时候会出现 The gm/convert binaries can't be found 的问题，重启电脑即可