require('../util').mockAllRepo();
jest.mock('../../authentication');

const { AccessToken } = require('../../authentication');
const controllers = require('../../controllers/CodeController');
const { CodeBuilder } = require('../../models/Code');
const { UserRepo, CodeRepo } = require('../../repositories');
const FakeRequestBuilder = require('./FakeRequest');
const FakeResponse = require('./FakeResponse');

describe('CodeController 단위 테스트', () => {
    beforeEach(() => {
        UserRepo.mockClear();
        CodeRepo.mockClear();


    });
    
    it('code 생성', async () => {

        AccessToken.mockImplementation(() => {
            return {
                issue: () => new AccessToken,
                getUserId: () => 1
            }
        });
        AccessToken.issue = jest.fn();

        const req = new FakeRequestBuilder()
            .setBody({
                title: 'title',
                content: 'content',
                language: 'language',
                description: 'description'
            })
            .setAuth(await AccessToken.issue('access_token'))
            .build();
        const res = new FakeResponse;
        await controllers.createCode(req, res);

        const codes = await CodeRepo.findAll();
        const expected_new_code = new CodeBuilder('title', 'language', 1).setContent('content').setDescription('description').build();
        expect(codes.map((code) => {
            code.id = null;
            return code;
        })).toContainEqual(expected_new_code);
    });
});

