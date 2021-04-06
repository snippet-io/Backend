jest.mock('../../configs');
process.env.DB_DATABASE = 'not_database';

const { loadDatabase } =require('../../loaders/database');

describe('DB 연결 테스트', () => {
    describe('연결 실패', () => {
        it('연결 실패', async() => {
            await expect(loadDatabase).rejects.toThrow();
        });
    });
});