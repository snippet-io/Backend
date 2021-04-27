const CodeQueryBuilder = require('../../querybuilders/Code');
const { CodeBuilder } = require('../../models/Code');
const { sequelize } = require('../../loaders/database');
const ServiceTime = require('../../utils/ServiceTime');

const simple_code_table = [new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setId(1).setDescription('설명').setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00Z')).build()];

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
    it('findAll 테스트', async () => {
        const result = await new CodeQueryBuilder().findAll().excute(transaction);
        expect(result).toEqual(simple_code_table);
    });
    it('findAll with pagination 테스트', async () => {
        const result = await new CodeQueryBuilder().findAll().paginate(5, 0).excute(transaction);
        expect(result).toEqual(simple_code_table);
    });
    it('search 테스트', async () => {
        const result = await new CodeQueryBuilder().findAll().searchOnTitleAndContent('내').excute(transaction);
        expect(result).toEqual(simple_code_table);
    });
    it('filterByAuthorId 테스트', async () => {
        const result = await new CodeQueryBuilder().findAll().filterByAuthorId(1).excute(transaction);
        expect(result).toEqual(simple_code_table);
    });
    it('filterById 테스트', async () => {
        const result = await new CodeQueryBuilder().findAll().filterById(1).excute(transaction);
        expect(result).toEqual(simple_code_table);
    });
    it('filterByLanguage 테스트', async () => {
        const result = await new CodeQueryBuilder().findAll().filterByLanguage('rust').excute(transaction);
        expect(result).toEqual(simple_code_table);
    });
    it('findByPk 테스트', async () => {
        const result = await new CodeQueryBuilder().findByPk(1).excute(transaction);
        expect(result.orElseThrow(new Error)).toEqual(simple_code_table[0]);
    });
    it('create 테스트', async () => {
        const new_code = new CodeBuilder('title', 'language', 1).setContent('content').build();
        const query = new CodeQueryBuilder();
        
        await query.create(new_code).excute(transaction);

        const codes = await query.findAll().excute(transaction);
        expect(codes.map((code) => {code.id = undefined; code.created_datetime = undefined; return code;})).toContainEqual(new_code);
    });
    it('update 테스트', async () => {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 1).setId(1).setContent('내용').build();
        const query = new CodeQueryBuilder();
        await query.update(modified_code).excute(transaction);

        const codes = await query.findAll().excute(transaction);
        expect(codes.map(code => {code.created_datetime = undefined; return code;})).toEqual([modified_code]);
    });
    it('delete 테스트', async () => {
        const query = new CodeQueryBuilder();
        await query.delete(1).excute(transaction);
        const result = await new CodeQueryBuilder().findAll().excute(transaction);
        expect(result).toEqual([]); 
    });
});