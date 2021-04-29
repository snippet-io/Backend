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
});