const { Router } = require("express");
const AuthRouter = require('./routes/AuthRouter');
const api = Router();

api.use('/auth/github', AuthRouter);
api.get('/simple', (req, res) => {
  res.send('3000');
});

module.exports = api;
