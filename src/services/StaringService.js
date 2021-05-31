const CodeQueryBuilder = require("../querybuilders/Code");
const StaringQueryBuilder = require("../querybuilders/Staring");

class StaringService {
  static async starCode(code_id, user_id) {
    await new StaringQueryBuilder().create({ code_id, user_id }).excute();
  }
  static async unstarCode(code_id, user_id) {
    await new StaringQueryBuilder().delete({ code_id, user_id }).excute();
  }
  static async getStaredCodeByUser(user_id, option) {
    let query = new CodeQueryBuilder().findAll().filterByStaringByUser(user_id);
    if (option?.language) {
      query = query.filterByLanguage(option.language);
    }
    if (option?.search) {
      query = query.searchOnTitleAndContent(option.search);
    }
    if (option?.order) {
      if (option.order == "stars") {
        query = query.orderByStarsCount();
      }
    }
    const stared_code_by_user = await query.excute();
    const staring_query = new StaringQueryBuilder();
    for (const code of stared_code_by_user) {
      code.setStarCount(
        await staring_query.count().filterByCode(code.getId()).excute()
      );
    }
    const result = stared_code_by_user;
    return result;
  }
}

module.exports = StaringService;
