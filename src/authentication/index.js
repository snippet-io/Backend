const JWT = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../configs');
const InvalidToken = require('../errors/TokenException');
const GithubApp = require('../external/GithubApp');

class AccessToken {
    static async issue(oauth_token) {
        try {
            const github_app = new GithubApp;
            const github_user = await github_app.getUser(oauth_token);
            const user_id = github_user.id;
            
            return await newAccessToken(user_id, oauth_token);
        } catch (e) {
            throw new InvalidToken;
        }
    }
    static async fromString(token) {
        try {
            const payload = JWT.verify(token, TOKEN_SECRET, { subject: 'access_token' });
            const github_user = await github_app.getUser(payload.oauth_token);
    
            if(github_user.id !== payload.user_id) throw new InvalidToken;
    
            const access_token = new AccessToken();
            access_token.token = token;
            access_token.user_id = payload.user_id;
            access_token.oauth_token = payload.oauth_token;
            access_token.sub = payload.sub;
            return access_token;   
        } catch (e) {
            throw new InvalidToken;
        }
    }
    toJSON() {
        return {
            access_token: this.token
        };
    }
    getUserId() {
        return this.user_id;
    }
    getOauthToken() {
        return this.oauth_token;
    }
    toString() {
        return this.token;
    }
}
class Tokens {
    constructor(tokens) {
        this.tokens = tokens;
    }

    toJSON() {
        const result = {};
        for(const token of this.tokens) {
            result[token.sub] = token.token;
        }
        return result;
    }
}

async function newAccessToken(user_id, oauth_token) {
    const access_token = new AccessToken();
    access_token.user_id = user_id;
    access_token.oauth_token = oauth_token;
    access_token.sub = 'access_token';
    access_token.token = JWT.sign({
        sub: 'access_token',
        user_id,
        oauth_token
    }, 
    TOKEN_SECRET, 
    {
        expiresIn: '7d'
    });

    return access_token;
}

module.exports = {
    AccessToken,
    Tokens,
};