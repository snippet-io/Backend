jest.mock('../../configs');
process.env.GITHUB_CLIENT_ID = 'client_id';
const { JsonWebTokenError } = require('jsonwebtoken');
const controllers = require('../../controllers/AuthController');
const FakeRequestBuilder = require('./FakeRequest');
const FakeResponse = require('./FakeResponse');

describe('AuthController 단위 테스트', () => {
    it('login, 성공적으로 리다이렉트', async () => {
        const req = new FakeRequestBuilder().setQuery({
            redirect: 'http://localhost'
        })
        const res = new FakeResponse();
        await controllers.login(req, res);

        expect(res.result).toBe(`https://github.com/login/oauth/authorize?redirect_uri=http://localhost&client_id=${process.env.GITHUB_CLIENT_ID}`);
    });  
});