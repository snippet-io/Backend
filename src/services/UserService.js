const { Forbidden, NotFound } = require("../errors/HttpException");
const UserQueryBuilder = require("../querybuilders/User");


class CodeService {
    static async getCodesOfUser(user_id) {
        const query = new UserQueryBuilder();
        const user = query.findByPk(user_id).includeCode().excute();
        return user.codes;
    }
}

module.exports = CodeService;