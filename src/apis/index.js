const { Router } = require("express");
const AuthRouter = require('./routes/AuthRouter');
const api = Router();

api.use('/auth/github', AuthRouter);


module.exports = api;