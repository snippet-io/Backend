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
}

module.exports = CodeService;