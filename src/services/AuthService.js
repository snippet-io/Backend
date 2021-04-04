const GithubApp = require('../external/GithubApp');
const { AccessToken } = require('../authentication');
const { UserBuilder } = require('../models/User');
const { UserRepo } = require('../repositories');
const { BadVerificationCode, Unauthorized } = require('../errors/HttpException');

class AuthService {
    static async createAccessToken(user_code) {
        const app = new GithubApp();

        let oauth_token;
        try {
            oauth_token = await app.issueAccessToken(user_code);
        } catch (e) {
            throw new BadVerificationCode;
        }
        
        const access_token = await AccessToken.issue(oauth_token);
        const user = new UserBuilder(access_token.user_id).build();
        UserRepo.create(user);

        return access_token;
    }
}


module.exports = AuthService;