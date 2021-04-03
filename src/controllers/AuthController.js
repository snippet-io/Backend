const configs = require('../configs');
const AuthService = require('../services/AuthService');
const controllers = {};

controllers.login = async (req, res, next) => {
    const redirect = req.query.redirect;
    return `https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${configs.GITHUB_CLIENT_ID}`;
};

controllers.issueAccessToken = async (req, res, next) => {
    const code = req.body.code;
    let access_token;
    access_token = await AuthService.createAccessToken(code);
    return access_token;
};

module.exports = controllers;