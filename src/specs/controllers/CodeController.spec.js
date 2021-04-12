require('../util').mockAllRepo();
jest.mock('../../external/GithubApp');
jest.mock('../../authentication');

const { AccessToken } = require('../../authentication');
const controllers = require('../../controllers/CodeController');
const { BadRequest, NotFound } = require('../../errors/HttpException');
const { CodeBuilder } = require('../../models/Code');
const { UserRepo, CodeRepo } = require('../../repositories');
const FakeRequestBuilder = require('../FakeRequest');
const FakeResponse = require('../FakeResponse');

describe('CodeController 단위 테스트', () => {
    beforeEach(() => {
        UserRepo.mockClear();
        CodeRepo.mockClear();


    });
    
    it('code 생성', async () => {

        AccessToken.mockImplementation(() => {
            return {
                getUserId: () => 1
            }
        });
        AccessToken.issue = jest.fn().mockImplementation(() => new AccessToken);
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
        expected_new_code.content = undefined;
        expected_new_code.description = undefined;
        expect(codes.map((code) => {
            code.id = null;
            code.description = undefined;
            return code;
        })).toContainEqual(expected_new_code);
        expect(res.getStatus()).toBe(201);
    });
    it('code 생성 실패(400) - content 없음', async () => {
        AccessToken.mockImplementation(() => {
            return {
                getUserId: () => 1
            }
        });
        AccessToken.issue = jest.fn().mockImplementation(() => new AccessToken);
        const req = new FakeRequestBuilder()
            .setBody({
                title: 'title',
                language: 'language',
                description: 'description'
            })
            .setAuth(await AccessToken.issue('access_token'))
            .build();
        const res = new FakeResponse;
        await expect(controllers.createCode(req, res)).rejects.toThrow(BadRequest);
    });
    it('code 삭제', async () => {
        const req = new FakeRequestBuilder().setParams({ id: 1 }).build();
        await controllers.deleteCode(req);

        const codes = await CodeRepo.findAll();
        expect(codes).toEqual([]);
    });
    it('code 삭제 실패(404) - 해당 code를 찾을 수 없음', async () => {
        const req = new FakeRequestBuilder().setParams({ id: 2 }).build();
        await expect(controllers.deleteCode(req)).rejects.toThrow(NotFound);
    });
});

