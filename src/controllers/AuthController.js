const configs = require('../configs');
const { BadRequest } = require('../errors/HttpException');
const AuthService = require('../services/AuthService');
const controllers = {};

controllers.login = async (req, res, next) => {
    const redirect = req.query.redirect;
    if(!redirect) {
        throw new BadRequest;
    }
    return {
        redirect_url: `https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${configs.GITHUB_CLIENT_ID}`
    }
};

controllers.issueAccessToken = async (req, res, next) => {
    const code = req.body.code;
    if(!code) {
        throw new BadRequest;
    }
    
    let access_token;
    access_token = await AuthService.createAccessToken(code);
    return access_token;
};

module.exports = controllers;