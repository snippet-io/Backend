require('../util').mockAllRepo();

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
            code.id = null;
            return code;
        })).toContainEqual(new_code);
    });
    it('코드 삭제 성공', async () => {
        await CodeService.deleteCode(1);
        const codes = await CodeRepo.findAll();
        expect(codes).toEqual([]);
    });
});