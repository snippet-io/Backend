jest.mock('../../querybuilders/Staring');
const StaringQueryBuilder = require("../../querybuilders/Staring");
const StaringService = require("../../services/StaringService");


describe('Code 서비스 단위 테스트', () => {
    beforeEach(() => {
        StaringQueryBuilder.mockClear();
    });
    it('코드 스타하기 테스트', async () => {
        await StaringService.starCode(1, 2);
        const staring = await new StaringQueryBuilder().findAll().excute();
        expect(staring).toContainEqual({code_id: 1, user_id: 2});
    });
});