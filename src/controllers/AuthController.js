const configs = require('../configs');
const controllers = {};

controllers.login = async (req, res, next) => {
    const redirect = req.query.redirect;
    res.redirect(`https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${configs.GITHUB_CLIENT_ID}`);
};

module.exports = controllers;