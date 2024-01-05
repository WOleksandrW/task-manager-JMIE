const cryptography = require('../func/cryptography');
require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const User = require('../models/User');
const router = express.Router();

function generateAccessToken(object) {
  return jwt.sign(object, process.env.ACCESS_TOKEN_SECRET)
}

router.post('/', async (req, res) => {
  const user = {
    email: cryptography.encrypt(req.body.email),
    password: cryptography.hash(req.body.password)
  }
  const users = await User.find({ ...user });
  if (users.length === 1) {
    const accessToken = generateAccessToken(user);
    res.json(accessToken);
  } else {
    res.sendStatus(400);
  }
})

module.exports = router;
