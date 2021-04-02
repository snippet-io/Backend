const configs = require('../configs');
const AuthService = require('../services/AuthService');
const controllers = {};

controllers.login = async (req, res, next) => {
    const redirect = req.query.redirect;
    res.redirect(`https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${configs.GITHUB_CLIENT_ID}`);
};

controllers.issueAccessToken = async (req, res, next) => {
    const code = req.body.code;
    const access_token = await AuthService.createAccessToken(code);
    res.send(access_token);
};

module.exports = controllers;