const { CodeRepo } = require("../repositories");


class CodeService {
    static async createCode(code) {
        await CodeRepo.create(code);
    }
}

module.exports = CodeService;