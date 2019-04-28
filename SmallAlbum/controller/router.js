const files = require('../models/files.js');

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