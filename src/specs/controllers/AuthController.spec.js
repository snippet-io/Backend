jest.mock('../../external/GithubApp');
jest.mock('../../repositories/definitions/UserRepo');
jest.spyOn(Date, 'now').mockImplementation(() => 1616466983480);
jest.mock('../../configs');
process.env.GITHUB_CLIENT_ID = 'client_id';
process.env.TOKEN_SECRET = 'token_secret';
const controllers = require('../../controllers/AuthController');
const FakeRequestBuilder = require('./FakeRequest');
const FakeResponse = require('./FakeResponse');

const GithubApp = require('../../external/GithubApp');
const { UserRepo } = require('../../repositories');

describe('AuthController 단위 테스트', () => {
    beforeEach(async () => {
        UserRepo.mockClear();
        GithubApp.mockClear();
    });
    it('login, 성공적으로 리다이렉트', async () => {
        const req = new FakeRequestBuilder().setQuery({
            redirect: 'http://localhost'
        })
        const res = new FakeResponse();
        const result = await controllers.login(req, res);

        expect(result).toBe(`https://github.com/login/oauth/authorize?redirect_uri=http://localhost&client_id=${process.env.GITHUB_CLIENT_ID}`);
    });
    
    it('access token을 성공적으로 발급', async () => {
        const expected_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhY2Nlc3NfdG9rZW4iLCJ1c2VyX2lkIjo1LCJvYXV0aF90b2tlbiI6Im1vY2tlZF9vYXV0aF90b2tlbiIsImlhdCI6MTYxNjQ2Njk4MywiZXhwIjoxNjE3MDcxNzgzfQ.nYIxhfwLvVTu1fNI4RMdvsdiLapX0Lh26fLh50pqCFU';

        const req = new FakeRequestBuilder().setBody({
            code: 'code'
        });
        const res = new FakeResponse();

        const result= await controllers.issueAccessToken(req, res);
        expect(result.toJSON()).toEqual({
            access_token: expected_token
        });
    });
});