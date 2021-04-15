require('../util').mockAllRepo();

const { Forbidden, NotFound } = require('../../errors/HttpException');
const { CodeBuilder } = require("../../models/Code");
const { UserRepo, CodeRepo } = require("../../repositories");
const CodeService = require('../../services/CodeService');


describe('Code 서비스 단위 테스트', () => {
    beforeEach(() => {
        UserRepo.mockClear();
        CodeRepo.mockClear();
    });
    it('코드 생성 성공', async () => {
        const new_code = new CodeBuilder('title', 'language', 1).setContent('content').build();
        await CodeService.createCode(new_code);

        const codes = await CodeRepo.findAll();
        new_code.content = undefined;
        expect(codes.map((code) => {
            code.id = undefined;
            return code;
        })).toContainEqual(new_code);
    });
    it('코드 삭제 성공', async () => {
        await CodeService.deleteCode(1);
        const codes = await CodeRepo.findAll();
        expect(codes).toEqual([]);
    });
    it('코드 업데이트 성공', async () => {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 1).setId(1).build();
        await CodeService.modifyCode(modified_code);

        const codes = await CodeRepo.findAll();
        expect(codes).toEqual([modified_code]);
    });
    it('코드 업데이트 실패 - 코드의 작성자 불일치', async ()=> {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 5).setId(1).build();
        await expect(CodeService.modifyCode(modified_code)).rejects.toThrow(Forbidden);
    });
    it('코드 업데이트 실패 - 찾을 수 없는 코드', async () => {
        const modified_code = new CodeBuilder('수정된 코드', 'c++', 1).setId(999).build();
        await expect(CodeService.modifyCode(modified_code)).rejects.toThrow(NotFound);
    });
});