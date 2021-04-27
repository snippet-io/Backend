const { UserBuilder } = require('../../models/User');
const { sequelize } = require('../../loaders/database');
const UserQueryBuilder = require('../../querybuilders/User');

const simple_user_table = [new UserBuilder(1).build()];

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
        // const users = await UserRepo.findAll();
        const users = await new UserQueryBuilder().findAll().excute(transaction);
        expect(users).toEqual(simple_user_table);
    });
    it('create 성공 케이스', async () => {
        const new_user = new UserBuilder(7).build();
        await new UserQueryBuilder().create(new_user).excute(transaction);
        // await UserRepo.create(new_user, transaction);
        const users = await new UserQueryBuilder().findAll().excute(transaction);
        // const users = await UserRepo.findAll(transaction);
        expect(users).toContainEqual(new_user);
    });
    it('findByPk 성공 케이스', async () => {
        const user = await new UserQueryBuilder().findByPk(1).excute(transaction);
        expect(user).toEqual(simple_user_table[0]);
    });
});