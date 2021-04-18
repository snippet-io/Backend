const { Router } = require("express");
const AuthRouter = require('./routes/AuthRouter');
const CodeRouter = require('./routes/CodeRouter');
const api = Router();


api.use('/auth/github', AuthRouter.getExpressRouter());
api.use('/codes', CodeRouter.getExpressRouter());
api.get('/simple', (req, res) => {
  res.send('3000');
});
api.post('/simple', (req, res) => {
  res.send('5000');
});

module.exports = api;
