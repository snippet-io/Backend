const { Forbidden, NotFound } = require("../errors/HttpException");
const CodeQueryBuilder = require("../querybuilders/Code");
const StaringQueryBuilder = require("../querybuilders/Staring");
const { CodeRepo } = require("../repositories");

class CodeService {
  static async createCode(code) {
    // await CodeRepo.create(code);
    await new CodeQueryBuilder().create(code).excute();
  }
  static async deleteCode(code_id, author_id) {
    const query = new CodeQueryBuilder();
    (await query.findByPk(code_id).excute()).orElseThrow(new NotFound());
    const codes_of_author = await query
      .findAll()
      .filterByAuthorId(author_id)
      .excute();

    if (
      codes_of_author.filter((code) => code.getId() === code_id).length === 0
    ) {
      throw new Forbidden();
    }

    await query.delete(code_id).excute();
  }
  static async modifyCode(code) {
    const query = new CodeQueryBuilder();
    (await query.findByPk(code.getId()).excute()).orElseThrow(new NotFound());

    if (
      (await query.update(code).filterByAuthorId(code.getAuthorId()).excute()) <
      1
    ) {
      throw new Forbidden();
    }
  }
  static async getCodes(option) {
    let query = new CodeQueryBuilder().findAll();

    if (option.language) {
      query = query.filterByLanguage(option.language);
    }
    if (option.search) {
      query = query.searchOnTitleAndContent(option.search);
    }
    if (option.pagination) {
      query = query.paginate(option.pagination.limit, option.pagination.offset);
    }
    if (option.order) {
      if (option.order == "stars") {
        query = query.orderByStarsCount();
      }
    }

    let codes = await query.excute();
    const staring_query = new StaringQueryBuilder();
    for (const code of codes) {
      code.setStarCount(
        await staring_query.count().filterByCode(code.getId()).excute()
      );
    }
    return codes;
  }
  static async getCode(id) {
    const code = (
      await new CodeQueryBuilder().findByPk(id).excute()
    ).orElseThrow(new NotFound());
    code.setStarCount(
      await new StaringQueryBuilder()
        .count()
        .filterByCode(code.getId())
        .excute()
    );
    return code;
  }
  static async isStarredUser(code_id, user_id) {
    const filtered_staring = await new StaringQueryBuilder()
      .findAll()
      .filterByCode(code_id)
      .filterByUser(user_id)
      .excute();

    if (filtered_staring.length < 1) {
      return false;
    }
    return true;
  }
}

module.exports = CodeService;
