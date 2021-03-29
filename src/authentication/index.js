const JWT = require('jsonwebtoken');
const { TOKEN_SECRET } = require('../configs');

class AccessToken {
    constructor(user_id) {
        if (user_id) {
            this.user_id = user_id;
            this.sub = 'access_token';
            this.token = JWT.sign({
                sub: 'access_token',
                user_id,
            }, 
            TOKEN_SECRET, 
            {
                expiresIn: '7d',
            });
        }
    }
    static fromString(token) {
        const payload = JWT.verify(token, TOKEN_SECRET, { subject: 'access_token' });
        const access_token = new AccessToken();
        access_token.token = token;
        access_token.user_id = payload.user_id;
        access_token.sub = payload.sub;
        return access_token;
    }
    toJSON() {
        return {
            access_token: this.token
        };
    }
    getUserId() {
        return this.user_id;
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

module.exports = {
    AccessToken,
    Tokens,
};