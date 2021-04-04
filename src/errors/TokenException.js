class InvalidToken extends Error {
    constructor() {
        super('Invalid token');
    }
}

module.exports = InvalidToken;