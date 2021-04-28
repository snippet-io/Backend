const { Forbidden, NotFound } = require("../errors/HttpException");
const GithubApp = require("../external/GithubApp");
const UserQueryBuilder = require("../querybuilders/User");


class CodeService {
    static async getCodesOfUser(user_id) {
        const query = new UserQueryBuilder();
        const user = query.findByPk(user_id).includeCode().excute();
        return user.codes;
    }
    static async getUser(user_id) {
        const github = new GithubApp();
        const stored_user = await new UserQueryBuilder().findByPk(user_id).excute();
        
        const user_data = await github.getUser(stored_user.getName());
        return {
            id: user_data.id,
            name: user_data.name,
            profile_image_url: user_data.avatar_url
        };
    }
}

module.exports = CodeService;