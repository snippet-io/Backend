const { AccessToken } = require("../../authentication");
const { Forbidden, Unauthorized }= require('../../errors/HttpException');

async function AccessTokenExtractor(req, res) {
    const stringfied_token = req.get('Authorization');

    if(!stringfied_token) {
        throw new Unauthorized;
    }

    let access_token;
    try {
        access_token = await AccessToken.fromString(stringfied_token);
    } catch (e) {
        throw new Forbidden;
    }
    req.auth = access_token;
};

module.exports = {
    AccessTokenExtractor
};