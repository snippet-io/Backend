jest.mock('../external/GithubApp');
const { AccessToken } = require("../authentication");
const InvalidToken = require("../errors/TokenException");
const GithubApp = require("../external/GithubApp");


describe('AccessToken 단위 테스트', () => {
    it('발급 실패 - 올바르지 않는 oauth 토큰', async () => {
        GithubApp.mockImplementation(() => {
            return {
                getUser: () => { throw new Error }
            }
        });

        await expect(AccessToken.issue('invalid_oauth_token')).rejects.toThrow(InvalidToken);
    });
});