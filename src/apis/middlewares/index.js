const { AccessToken } = require("../../authentication");

async function AccessTokenExtractor(req, res) {
    const stringfied_token = req.get('Authorization');

    const access_token = await AccessToken.fromString(stringfied_token);
    req.auth = access_token;
};

module.exports = {
    AccessTokenExtractor
};