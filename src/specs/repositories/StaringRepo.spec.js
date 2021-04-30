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
    it('create 성공', async () => {
        await new StaringQueryBuilder().create({code_id: 1, user_id: 2}).excute(transaction);
        const starings = await new StaringQueryBuilder().findAll().excute(transaction);
        expect(starings).toContainEqual({code_id: 1, user_id: 2});
    });
    it('delete 성공', async () => {
        const query = new StaringQueryBuilder();
        const number_of_deleted = await query.delete({code_id: 1, user_id: 1}).excute(transaction);
        const starings = await query.findAll().excute(transaction);

        expect(number_of_deleted).toBe(1);
        expect(starings).not.toContainEqual({code_id: 1, user_id: 1});
    });
    it('include stared code 성공', async () => {
        const starings = await new StaringQueryBuilder().findAll().includeStaredCode().excute(transaction);
        expect(starings).toEqual(simple_staring_table);
    });
    it('count 성공', async () => {
        const number = await new StaringQueryBuilder().count().excute();
        expect(number).toBe(1);
    });
});