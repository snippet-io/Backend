jest.mock('../../querybuilders/User');
jest.mock('../../querybuilders/Code');
jest.mock('../../external/GithubApp');

const controllers = require('../../controllers/UserController');
const { BadRequest, NotFound } = require('../../errors/HttpException');
const { CodeBuilder } = require('../../models/Code');
const FakeRequestBuilder = require('../FakeRequest');
const FakeResponse = require('../FakeResponse');
const UserQueryBuilder = require('../../querybuilders/User');
const GithubApp = require("../../external/GithubApp");
const CodeQueryBuilder = require('../../querybuilders/Code');

describe('CodeController 단위 테스트', () => {
    beforeEach(() => {
        UserQueryBuilder.mockClear();
        CodeQueryBuilder.mockClear();
    });
    it('getCodesOfUser 테스트', async () => {
        const req = new FakeRequestBuilder().setParams({
            id: 1
        }).build();
        const result = await controllers.getCodesOfUser(req);
        expect(result.map(r => r.toJSON())).toEqual([{
            id: 1,
            title: '코드제목',
            language: 'rust',
            content: '내용',
            description: '설명',
            author: 1,
            created_datetime: '2021-04-19T09:00:00.000+09:00'
        }]);
    });
    it('getCodesOfUser 테스트 - language 특정', async () => {
        const req = new FakeRequestBuilder()
            .setParams({
                id: 1
            })
            .setQuery({
                language: 'rust'
            }).build();
        const result = await controllers.getCodesOfUser(req);
        expect(result.map(r => r.toJSON())).toEqual([{
            id: 1,
            title: '코드제목',
            language: 'rust',
            content: '내용',
            description: '설명',
            author: 1,
            created_datetime: '2021-04-19T09:00:00.000+09:00'
        }]);
    });
    it('getUser 테스트', async () => {
        GithubApp.mockImplementation(() => ({
            getUserById: (id) => id == 1 ? ({
                id: 1,
                login: "Jungwoo-Son",
            }) : undefined,
            getUser: (user_name) => user_name == 'Jungwoo-Son' ? ({
                name: "Jungwoo Son",
                id: 1,
                avatar_url: "https://avatars.githubusercontent.com/u/44115353?v=4",
            }) : undefined
        }));
        const req = new FakeRequestBuilder().setParams({
            id: 1
        }).build();
        const result = await controllers.getUser(req);
        expect(result).toEqual({
            id: 1,
            name: 'Jungwoo Son',
            profile_image_url: 'https://avatars.githubusercontent.com/u/44115353?v=4'
        });
    });
});