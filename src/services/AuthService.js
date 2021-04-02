const GithubApp = require('../external/GithubApp');
const { AccessToken } = require('../authentication');
const { UserBuilder } = require('../models/User');
const { UserRepo } = require('../repositories');

class AuthService {
    static async createAccessToken(user_code) {
        const app = new GithubApp();

        const oauth_token = await app.issueAccessToken(user_code);
        const user_data = await app.getUser(oauth_token);
        const user_id = user_data.id;
        const access_token = new AccessToken(user_id, oauth_token);
        const user = new UserBuilder(user_id).build();
        UserRepo.create(user);

        return access_token;
    }
}


module.exports = AuthService;