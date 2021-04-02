const { GITHUB_CLIENT_ID } = require('../../configs');

const getLoginURL = jest.fn().mockImplementation(() => {
    return `https://github.com/login/oauth/authorize?redirect_uri=${redirect}&client_id=${GITHUB_CLIENT_ID}`;
});
const issueAccessToken = jest.fn().mockImplementation(() => {
    return 'mocked_oauth_token';
});
const getUser = jest.fn().mockImplementation(() => {
    return {
        id: 5
    };
});
const mock = jest.fn().mockImplementation(() => {
    return {
        getLoginURL: getLoginURL,
        issueAccessToken: issueAccessToken,
        getUser: getUser
    };
});

module.exports = mock;