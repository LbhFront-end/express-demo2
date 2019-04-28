const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const files = require('../models/files.js');
const sd = require('silly-datetime');

exports.showIndex = (req, res, next) => {
  res.render('index', { folder: files.getAllAlbums() || {} }, (err, html) => {
    if (err) {
      next();
      return;
    };
    res.send(html)
  })
}

exports.showAlbum = (req, res, next) => {
  const { albumName } = req.params;
  res.render('album', {
    files: files.getAllImagesByAlbumName(albumName) || [],
    albumName
  }, (err, html) => {
    if (err) {
      next();
      return;
    };
    res.send(html)
  })
}

exports.showUp = (req, res, next) => {
  res.render('form', {
    folder: files.getAllAlbums() || {}
  }, (err, html) => {
    if (err) {
      next();
      return;
    };
    res.send(html)
  })
}

exports.handleUpload = (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = './tempUpload';
  form.parse(req, (err, fileds, files,next) => {
    if (err) {
      next();
      return;
    }
    const { size } = files.picture;
    const olaPath = files.picture.path;
    if (size > 1024) {
      res.send('图片尺寸不要超过1M');
      fs.unlink(olaPath)
      return;
    }
    const { folder } = fileds
    const time = sd.format(new Date(), 'YYYYMMDDHHmmss');
    const ran = parseInt(Math.random() * 89999 + 10000);
    const extname = path.extname(files.picture.name);
    const newPath = path.normalize(__dirname + '/../uploads/' + folder + '/' + time + ran + extname);
    fs.rename(olaPath, newPath, (err) => {
      if (err) throw Error(err)
    })
    res.send('success');
  })

}