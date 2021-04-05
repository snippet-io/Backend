const { CodeRepo } = require('../../repositories');
const { CodeBuilder } = require('../../models/Code');
const { sequelize } = require('../../loaders/database');

const simple_code_table = [new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setId(1).setDescription('설명').build()];

describe('Code Repo 통합 테스트', () => {
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
        const codes = await CodeRepo.findAll();
        expect(codes).toEqual(simple_code_table.map((code) => { return {
            id: code.getId(),
            title: code.getTitle(),
            content: undefined,
            description: undefined,
            author: code.getAuthor(),
            language: code.getLanguage()
        }}));
    });
    it('findById 성공 케이스', async () => {
        const code = await CodeRepo.findById(1);
        expect(code).toEqual(simple_code_table[0]);
    });
    it('create 성공 케이스', async () => {
        const new_code = new CodeBuilder('title', 'language', 1).setContent('content').build();
        await CodeRepo.create(new_code, transaction);
        const codes = await CodeRepo.findAll(transaction);
        new_code.content = undefined;
        expect(codes.map((code) => {code.id=null; return code;})).toContainEqual(new_code);
    });
});