const { Forbidden, NotFound } = require("../errors/HttpException");
const GithubApp = require("../external/GithubApp");
const CodeQueryBuilder = require("../querybuilders/Code");
const StaringQueryBuilder = require("../querybuilders/Staring");
const UserQueryBuilder = require("../querybuilders/User");

class CodeService {
  static async getCodesOfUser(user_id, option) {
    let query = new CodeQueryBuilder();
    query = query.findAll().filterByAuthorId(user_id);

    if (option?.language) {
      query = query.filterByLanguage(option.language);
    }
    if (option?.search) {
      query = query.searchOnTitleAndContent(option.search);
    }
    if (option?.order == "stars") {
      query = query.orderByStarsCount();
    }

    const user_codes = query.excute();
    const staring_query = new StaringQueryBuilder();
    for (const code of user_codes) {
      code.setStarCount(
        await staring_query.count().filterByCode(code.getId()).excute()
      );
    }
    return user_codes;
  }
  static async getUser(user_id) {
    const github = new GithubApp();
    const stored_user = await new UserQueryBuilder().findByPk(user_id).excute();

    let user_data = await github.getUserById(stored_user.getId());
    user_data = await github.getUser(user_data.login);
    return {
      id: user_data.id,
      name: user_data.name,
      profile_image_url: user_data.avatar_url,
    };
  }
}

module.exports = CodeService;
