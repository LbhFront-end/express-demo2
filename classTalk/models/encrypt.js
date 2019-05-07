const crypto = require('crypto');

module.exports = function encrypt(password) {
  const md5 = crypto.createHash('md5');
  return md5.update(password).digest('base64');
}