jest.mock('../../querybuilders/Code');
const { Forbidden, NotFound } = require('../../errors/HttpException');
const { CodeBuilder } = require("../../models/Code");
const CodeService = require('../../services/CodeService');
const ServiceTime = require('../../utils/ServiceTime');
const CodeQueryBuilder = require('../../querybuilders/Code');

const sample_code = new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setDescription('설명').setId(1).setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build();

describe('Code 서비스 단위 테스트', () => {
    beforeEach(() => {
        CodeQueryBuilder.mockClear();
    });
    it('코드 생성 성공', async () => {
        const new_code = new CodeBuilder('title', 'language', 1).setContent('content').build();
        await CodeService.createCode(new_code);

        const codes = await new CodeQueryBuilder().findAll().excute();
        expect(codes.map((code) => {
            code.id = undefined;
            code.created_datetime = undefined;
            return code;
        })).toContainEqual(new_code);
    });
    it('코드 삭제 성공', async () => {
        await CodeService.deleteCode(1, 1);
        const codes = await new CodeQueryBuilder().findAll().excute();
        expect(codes).toEqual([]);
    });
    it('코드 삭제 실패 - 코드의 작성자 불일치', async () => {
        await expect(CodeService.deleteCode(1, 2)).rejects.toThrow(Forbidden);
    });
    it('코드 삭제 실패 - 찾을 수 없는 코드', async () => {
        await expect(CodeService.deleteCode(999, 1)).rejects.toThrow(NotFound);
    });
    it('코드 업데이트 성공', async () => {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 1).setId(1).build();
        await CodeService.modifyCode(modified_code);

        const result = await new CodeQueryBuilder().findAll().excute().map(c => {
            c.created_datetime = undefined;
            c.description = undefined;
            c.content = undefined;
            return c;
        });
        expect(result).toEqual([modified_code]);
    });
    it('코드 업데이트 실패 - 코드의 작성자 불일치', async ()=> {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 5).setId(1).build();
        await expect(CodeService.modifyCode(modified_code)).rejects.toThrow(Forbidden);
    });
    it('코드 업데이트 실패 - 찾을 수 없는 코드', async () => {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 1).setId(999).build();
        await expect(CodeService.modifyCode(modified_code)).rejects.toThrow(NotFound);
    });
    it('코드 리스트 얻기 성공', async () => {
        const codes = await CodeService.getCodes(5, 0);
        expect(codes).toEqual([new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setDescription('설명').setId(1).setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build()]);
    });
    it('코드 얻기 성공', async () => {
        const code = await CodeService.getCode(1);
        expect(code).toEqual(new CodeBuilder('코드제목', 'rust', 1).setContent('내용').setDescription('설명').setId(1).setCreatedDatetime(new ServiceTime('2021-04-19T00:00:00.000Z')).build());
    });
    it('코드 얻기 실패 - 찾을 수 없는 코드', async () => {
        expect(CodeService.getCode(999)).rejects.toThrow(NotFound);
    });
    it('코드 검색 성공', async () => {
        const codes = await CodeService.searchCodeWithPaging('내', 5, 0);
        expect(codes).toEqual([sample_code]);
    });
});