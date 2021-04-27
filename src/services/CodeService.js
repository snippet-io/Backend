const { Forbidden, NotFound } = require("../errors/HttpException");
const CodeQueryBuilder = require("../querybuilders/Code");
const { CodeRepo } = require("../repositories");


class CodeService {
    static async createCode(code) {
        // await CodeRepo.create(code);
        await new CodeQueryBuilder().create(code).excute();
    }
    static async deleteCode(code_id, author_id) {
        const query = new CodeQueryBuilder();
        (await query.findByPk(code_id).excute()).orElseThrow(new NotFound);
        const codes_of_author = await query.findAll().filterByAuthorId(author_id).excute();
        
        if(codes_of_author.filter(code => code.getId() === code_id).length === 0) {
            throw new Forbidden;
        }

        await query.delete(code_id).excute();
    }
    static async modifyCode(code){
        const query = new CodeQueryBuilder();
        await query.findByPk(code.getId()).excute().orElseThrow(new NotFound);
        
        if(await query.update(code).filterByAuthorId(code.getAuthorId()).excute() < 1) {
            throw new Forbidden;
        }
    }
    static async getCodes(limit, offset) {
        return await new CodeQueryBuilder().findAll().paginate(limit, offset).excute();
    }
    static async getCode(id) {
        return (await new CodeQueryBuilder().findByPk(id).excute()).orElseThrow(new NotFound);
    }
    static async searchCodeWithPaging(search, limit, offset) {
        const codes = await (new CodeQueryBuilder().findAll().searchOnTitleAndContent(search).paginate(limit, offset).excute());
        return codes;
    }
}

module.exports = CodeService;