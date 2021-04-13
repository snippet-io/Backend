const { CodeRepo } = require("../repositories");


class CodeService {
    static async createCode(code) {
        await CodeRepo.create(code);
    }
    static async deleteCode(code_id) {
        await CodeRepo.delete(code_id);
    }
    static async modifyCode(code){
        await CodeRepo.update(code);
    }
}

module.exports = CodeService;