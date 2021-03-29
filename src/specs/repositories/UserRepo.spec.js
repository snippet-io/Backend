jest.mock('../../configs');
process.env.DB_DATABASE = 'snippet';
process.env.DB_USERNAME = 'root';
process.env.DB_HOST = 'localhost';
const { UserRepo } = require('../../repositories');
const { UserBuilder } = require('../../models/User');
const { sequelize } = require('../../loaders/database');

const simple_user_table = [new UserBuilder(1).build()];

describe('User Repo 통합 테스트', () => {
    let transaction;
    beforeEach(async () => {
        transaction = await sequelize.transaction();
    });
    afterEach(async () => {
        await transaction.rollback();
    });
    it('findAll 성공 케이스', async () => {
        const users = await UserRepo.findAll();
        expect(users).toEqual(simple_user_table);
    });
    it('create 성공 케이스', async () => {
        const new_user = new UserBuilder(7).build();
        await UserRepo.create(new_user, transaction);
        const users = await UserRepo.findAll();
        expect(users).toContainEqual(new_user);
    });
});