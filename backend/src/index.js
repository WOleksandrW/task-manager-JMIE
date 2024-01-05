const express = require('express');
const mongoose = require('mongoose');
const createWebSocketServer = require('./web-socket');

const users = require('./api/users');
const auth = require('./api/auth');
const noted = require('./api/noted');
const columns = require('./api/columns');

const PORT = process.env.PORT || 5050;

const app = express();
const http = require('http').createServer(app);

const userDucts = createWebSocketServer(http);
app.locals.userDucts = userDucts;

app.use(express.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
  next();
});

app.use("/api/users", users);
app.use("/api/columns", columns);
app.use("/api/noted", noted);
app.use("/func/auth", auth);

async function start() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb+srv://database-access:6rNLcb9Q4Ou2GQsY@cluster0.qcdcykg.mongodb.net/project-jmie-db');
    http.listen(PORT, () => console.log(`Server is running in port ${PORT}`));
  } catch (err) {
    console.log(err);
  }
}

start();