const GithubApp = require('../external/GithubApp');
const { AccessToken } = require('../authentication');
const { UserBuilder } = require('../models/User');
const { UserRepo } = require('../repositories');
const { BadVerificationCode, Unauthorized } = require('../errors/HttpException');
const UserQueryBuilder = require('../querybuilders/User');

class AuthService {
    static async createAccessToken(user_code) {
        const app = new GithubApp();

        let github_user;
        try {
            const github_app = new GithubApp;
            github_user = await github_app.getUser(user_code);
        } catch (e) {
            throw new BadVerificationCode;
        }
        const oauth_token = await app.issueAccessToken(user_code);
        
        const access_token = await AccessToken.issue(github_user.id, oauth_token);
        const user = new UserBuilder(access_token.user_id, github_user.login).build();
        // UserRepo.create(user);
        await new UserQueryBuilder().upsert(user).excute();

        return access_token;
    }
}


module.exports = AuthService;