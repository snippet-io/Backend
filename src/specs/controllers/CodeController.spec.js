jest.mock('../../querybuilders/Code');
jest.mock('../../external/GithubApp');
jest.mock('../../authentication');

const { AccessToken } = require('../../authentication');
const controllers = require('../../controllers/CodeController');
const { BadRequest, NotFound } = require('../../errors/HttpException');
const { CodeBuilder } = require('../../models/Code');
const FakeRequestBuilder = require('../FakeRequest');
const FakeResponse = require('../FakeResponse');
const CodeQueryBuilder = require('../../querybuilders/Code');

describe('CodeController 단위 테스트', () => {
    beforeEach(() => {
        CodeQueryBuilder.mockClear();
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

        const codes = await new CodeQueryBuilder().findAll().excute();
        const expected_new_code = new CodeBuilder('title', 'language', 1).setContent('content').setDescription('description').build();
        expected_new_code.description = undefined;
        expect(codes.map((code) => {
            code.id = undefined;
            code.description = undefined;
            code.created_datetime = undefined;
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
        AccessToken.mockImplementation(() => {
            return {
                getUserId: () => 1
            }
        });
        AccessToken.issue = jest.fn().mockImplementation(() => new AccessToken);

        const req = new FakeRequestBuilder().setParams({ id: 1 }).setAuth(AccessToken.issue()).build();
        await controllers.deleteCode(req);

        const codes = await new CodeQueryBuilder().findAll().excute();
        expect(codes).toEqual([]);
    });
    it('code 삭제 실패(400)', async () => {
        await expect(controllers.deleteCode(new FakeRequestBuilder().build())).rejects.toThrow(BadRequest);
    });
    it('code 삭제 실패(404) - 해당 code를 찾을 수 없음', async () => {
        AccessToken.mockImplementation(() => {
            return {
                getUserId: () => 1
            }
        });
        AccessToken.issue = jest.fn().mockImplementation(() => new AccessToken);

        const req = new FakeRequestBuilder().setParams({ id: 2 }).setAuth(AccessToken.issue()).build();
        await expect(controllers.deleteCode(req)).rejects.toThrow(NotFound);
    });
    it('code 수정', async () => {
        AccessToken.mockImplementation(() => {
            return {
                getUserId: () => 1
            }
        });
        AccessToken.issue = jest.fn().mockImplementation(() => new AccessToken);

        const req = new FakeRequestBuilder()
            .setAuth(AccessToken.issue('access_token'))
            .setParams({ id: 1 })
            .setBody({
                title: '수정된 코드',
                content: '내',
                language: 'c++',
            }).build();
        await controllers.modifyCode(req, new FakeResponse);
        
        const codes = await new CodeQueryBuilder().findAll().excute();
        expect(codes.map(code => {
            code.created_datetime = undefined;
            return code;
        })).toEqual([new CodeBuilder('수정된 코드', 'c++', 1).setContent('내').setDescription('설명').setId(1).build()]);
    });
    it('code 수정 실패(400)', async () => {
        await expect(controllers.modifyCode(new FakeRequestBuilder().build())).rejects.toThrow(BadRequest);
    });
    it('code list 얻기', async () => {
        const req = new FakeRequestBuilder().setQuery({limit: 5, offset: 0});
        const codes = await controllers.getCodes(req, new FakeResponse);
        expect(codes.map(c => c.toJSON())).toEqual([{
            id: 1,
            title: '코드제목',
            content: '내용',
            language: 'rust',
            description: '설명',
            author: 1,
            created_datetime: '2021-04-19T09:00:00.000+09:00'
        }]);
    });
    it('code list 얻기 실패(400)', async () => {
        await expect(controllers.getCodes(new FakeRequestBuilder().build())).rejects.toThrow(BadRequest);
    });
    it('code 얻기', async () => {
        const req = new FakeRequestBuilder().setParams({id: 1}).build();
        const result = await controllers.getCode(req);
        expect(result.toJSON()).toEqual({
            id: 1,
            title: '코드제목',
            author: 1,
            language: 'rust',
            content: '내용',
            description: '설명',
            created_datetime: '2021-04-19T09:00:00.000+09:00'
        });
    });
    it('code 얻기 실패(400)', async () => {
        await expect(controllers.getCode(new FakeRequestBuilder().build())).rejects.toThrow(BadRequest);
    });
    it('code 검색 성공', async () => {
        const req = new FakeRequestBuilder().setQuery({
            limit: 5,
            offset: 0,
            search: '내'
        }).build();
        const codes = await controllers.searchCode(req);
        expect(codes.map(code => code.toJSON())).toEqual([{
            id: 1,
            title: '코드제목',
            author: 1,
            language: 'rust',
            content: '내용',
            description: '설명',
            created_datetime: '2021-04-19T09:00:00.000+09:00'
        }]);
    });
    it('code 검색 실패(400)', async () => {
        const req = new FakeRequestBuilder().build();
        await expect(controllers.searchCode(req)).rejects.toThrow(BadRequest);
    });
});

