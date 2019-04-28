const fs = require('fs');
const Folder = {};

exports.getAllAlbums = () => {
  return getFloder();
}

exports.getAllImagesByAlbumName = (albumName) => {
  const folder = getFloder();
  const path = './uploads/' + albumName + '/';
  const imgFiles = fs.readdirSync(path, 'utf-8');
  const realFiles = imgFiles.map(v => '/' + albumName + '/' + v);
  if (folder[albumName]) {
    const temp = folder[albumName].concat(realFiles);
    folder[albumName] = [...new Set(temp)]
  }
  return folder[albumName];
}

const getFloder = () => {
  const files = fs.readdirSync('./uploads/', 'utf-8');
  for (let i = 0; i < files.length; i++) {
    const info = fs.statSync('./uploads/' + files[i]);
    if (info.isDirectory()) {
      Folder[files[i]] = Folder[files[i]] || [];
    }
  }
  return Folder
}