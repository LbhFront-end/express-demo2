const express = require('express');
const bodyParser = require('body-parser');
const router = require('./controller/router.js');

const app = new express();
app.use(express.static('./public'));
app.use(express.static('./uploads'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', router.showIndex)
app.get('/:albumName', router.showAlbum)
// 最后的中间件，404
app.use((req, res) => {
  res.render('404');
})
app.listen(3000);