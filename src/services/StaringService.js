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
    const query = new CodeQueryBuilder()
      .findAll()
      .filterByStaringByUser(user_id);
    if (option.language) {
      query = query.filterByLanguage(option.language);
    }
    if (option.search) {
      query = query.searchOnTitleAndContent(option.search);
    }
    if (option.order) {
      if (option.order == "stars") {
        query = query.orderByStarsCount();
      }
    }
    const starings_of_user = await query.excute();
    const result = starings_of_user.map((staring) => staring.stared_code);
    return result;
  }
}

module.exports = StaringService;
