const { sequelize } = require('../../loaders/database');
const StaringQueryBuilder = require('../../querybuilders/Staring');

const simple_staring_table = [{code_id: 1, user_id: 1}];

describe('User Repo 통합 테스트', () => {
    let transaction;
    beforeEach(async () => {
        transaction = await sequelize.transaction();
    });
    afterEach(async () => {
        await transaction.rollback();
    });
    afterAll(async () => {
        await sequelize.close();
    });
    it('findAll 성공 케이스', async () => {
        const starings = await new StaringQueryBuilder().findAll().excute(transaction);
        expect(starings).toEqual(simple_staring_table);
    });
});