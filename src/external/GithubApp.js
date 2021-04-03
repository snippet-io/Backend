const axios = require('axios');
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} = require('../configs');
const { BadVerificationCode, Unauthorized } = require('../errors/GithubAppException');

class AxiosException extends Error {
    constructor(axios_err) {
        super(axios_err.message);
    }
}

class GithubApp {
    static AuthRequester = axios.create({
        baseURL: 'https://github.com/login/oauth',
        headers: { Accept: 'application/json'} 
    });
    static AppRequester = axios.create({
        baseURL: 'https://api.github.com',
        headers: { Accept: 'application/json'}
    });
    async getLoginURL(redirect) {
        return `https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${GITHUB_CLIENT_ID}`;
    }
    async issueAccessToken(user_code) {
        let res 
        try {
            res = await GithubApp.AuthRequester.post('/access_token', {   
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code: user_code
            });
        }
        catch (e) {
            throw new AxiosException(e);
        }
        if(res.data.error == 'bad_verification_code') {
            throw new BadVerificationCode;
        }
        return res.data.access_token;
    }
    async getUser(access_token) {
        let data;
        try {
            let res = await GithubApp.AppRequester.get('/user', {
                headers: {Authorization: `token ${access_token}`}
            });
            data = res.data;
        }
        catch(e) {
            if(e.status == 401) {
                throw new Unauthorized;
            }
            else {
                throw new AxiosException(e);
            }
        }
        return data;
    }
}

module.exports = GithubApp;