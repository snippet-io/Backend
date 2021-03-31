const axios = require('axios');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = require('../configs');
const { AccessToken } = require('../authentication');
const { UserBuilder } = require('../models/User');
const { UserRepo } = require('../repositories');

class AuthService {
    static async createAccessToken(user_code) {
        const github_token = await getAccessTokenFromGithub(user_code);   
        const oauth_token = github_token.access_token;
        const user_data = await getUser(oauth_token);
        const user_id = user_data.id;
        const access_token = new AccessToken(user_id, oauth_token);
        
        const user = new UserBuilder(user_id).build();
        UserRepo.create(user);

        return access_token;
    }
}
async function getUser(oauth_token) {
    const { data } = await axios.get('https://api.github.com/user', {
        headers: {
            Authorization: `token ${oauth_token}`
        }
    });
    return data;
}
async function getAccessTokenFromGithub(user_code) {
    const res = await axios.post('https://github.com/login/oauth/access_token', {
        data: {
            client_id: GITHUB_CLIENT_ID,
            client_secret: GITHUB_CLIENT_SECRET,
            code: user_code
        },
        headers: {
            Accept: 'application/json'
        }
    });
    return res.data;
}

module.exports = AuthService;