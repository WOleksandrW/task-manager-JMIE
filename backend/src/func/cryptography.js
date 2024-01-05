const crypto = require('crypto');
require('dotenv').config();

function encrypt(message) {
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY, 'hex'), Buffer.from(process.env.INITIALIZATION_VECTOR, 'hex'));
  let encrypted = cipher.update(message, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decrypt(message) {
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY, 'hex'), Buffer.from(process.env.INITIALIZATION_VECTOR, 'hex'));
  let decrypted = decipher.update(message, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function hash(message) {
  const hmac = crypto.createHash('sha256');
  hmac.update(message);
  return hmac.digest('hex');
}

module.exports = { encrypt, decrypt, hash };
