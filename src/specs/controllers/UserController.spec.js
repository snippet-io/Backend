jest.mock('../../querybuilders/User');

const controllers = require('../../controllers/UserController');
const { BadRequest, NotFound } = require('../../errors/HttpException');
const { CodeBuilder } = require('../../models/Code');
const FakeRequestBuilder = require('../FakeRequest');
const FakeResponse = require('../FakeResponse');
const UserQueryBuilder = require('../../querybuilders/User');

describe('CodeController 단위 테스트', () => {
    beforeEach(() => {
        UserQueryBuilder.mockClear();
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
});