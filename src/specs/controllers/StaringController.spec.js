jest.mock('../../querybuilders/Staring');
jest.mock('../../authentication')
const StaringQueryBuilder = require("../../querybuilders/Staring");
const FakeRequestBuilder = require('../FakeRequest');
const controllers = require('../../controllers/StaringController');
const { AccessToken } = require("../../authentication");

describe('CodeController 단위 테스트', () => {
    beforeEach(() => {
        StaringQueryBuilder.mockClear();
    });
    it('starCode 성공', async () => {
        AccessToken.issue = () => ({
            getUserId: () => 2
        });
        const req = new FakeRequestBuilder()
            .setParams({
                id: 1
            })
            .setAuth(AccessToken.issue())
            .build();
        
        await controllers.starCode(req);

        const starings = new StaringQueryBuilder().findAll().excute();
        expect(starings).toContainEqual({code_id: 1, user_id: 2});
    });
    it('unstarCode 성공', async () => {
        AccessToken.issue = () => ({
            getUserId: () => 1
        });
        const req = new FakeRequestBuilder()
            .setParams({
                id: 1
            })
            .setAuth(AccessToken.issue())
            .build();
        
        await controllers.unstarCode(req);

        const starings = new StaringQueryBuilder().findAll().excute();
        expect(starings).not.toContainEqual({code_id: 1, user_id: 2});
    });
    it('getStaredCodeByUser 성공', async () => {
        const req = new FakeRequestBuilder().setParams({id: 1}).build();
        const result = await controllers.getStaredCodeByUser(req);
        expect(result.map(r => r.toJSON())).toEqual([{
            id: 1,
            title: '코드제목',
            author: 1,
            language: 'rust',
            content: '내용',
            description: '설명',
            created_datetime: '2021-04-19T09:00:00.000+09:00'
        }]);
    });
});