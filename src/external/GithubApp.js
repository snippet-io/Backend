const axios = require('axios');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = require('../configs');

class GithubApp {
    static AuthRequester = axios.create({
        baseURL: 'https://github.com/login/oauth' 
    });
    static AppRequester = axios.create({
        baseURL: 'https://api.github.com',
        headers: { Accept: 'application/json'}
    });
    async getLoginURL(redirect) {
        return `https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${GITHUB_CLIENT_ID}`;
    }
    async issueAccessToken(user_code) {
        const res = await GithubApp.AuthRequester.post('/access_token', {
            data: {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: user_code
            },
        });
        return res.data.access_token;
    }
    async getUser(access_token) {
        const { data } = await GithubApp.AppRequester.get('/user', {
            headers: {
                Authorization: `token ${oauth_token}`
            }
        });
        return data;
    }
}

module.exports = GithubApp;