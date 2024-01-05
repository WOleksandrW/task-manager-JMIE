require('dotenv').config();

const jwt = require('jsonwebtoken');

function authenticateToken(strToken) {
  const token = strToken && strToken.split(' ')[1];
  if (token == null) return { type: 'error', code: '401' };

  let result;

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) result = { type: 'error', code: '403' };
    else result = user;
  });

  return result;
}

module.exports = authenticateToken;
