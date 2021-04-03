class IncorrectClientCredentials extends Error{
    constructor() {
        super('The client_id and/or client_secret passed are incorrect.');
    }
}
class BadVerificationCode extends Error {
    constructor() {
        super('The code passed is incorrect or expired.');
    }
}
class Unauthorized extends Error {
    constructor() {
        super('Unable to authenticate access token.');
    }
}

module.exports = {
    IncorrectClientCredentials,
    BadVerificationCode,
    Unauthorized
};