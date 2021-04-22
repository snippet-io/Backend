const { Forbidden, NotFound } = require("../errors/HttpException");
const { CodeRepo } = require("../repositories");


class CodeService {
    static async createCode(code) {
        await CodeRepo.create(code);
    }
    static async deleteCode(code_id, author_id) {
        (await CodeRepo.findById(code_id)).orElseThrow(new NotFound);
        const codes_of_author = await CodeRepo.findByAuthorId(author_id);
        
        if(codes_of_author.filter(code => code.getId() === code_id).length === 0) {
            throw new Forbidden;
        }


        await CodeRepo.delete(code_id);
    }
    static async modifyCode(code){
        (await CodeRepo.findById(code.getId())).orElseThrow(new NotFound);
        
        await CodeRepo.update(code);
    }
    static async getCodes(limit, offset) {
        return await CodeRepo.findAllLimitedTo(limit, offset);
    }
    static async getCode(id) {
        return await (await CodeRepo.findById(id)).orElseThrow(new NotFound);
    }
    static async searchCodeWithPaging(search, limit, offset) {
        const codes = await CodeRepo.findAllLikeTitleOrContentLimitedTo(search, limit, offset);
        return codes;
    }
}

module.exports = CodeService;