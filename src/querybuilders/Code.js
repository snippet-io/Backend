const QueryBuilderMaker = require("@yeoul/sequelize-querybuilder");
const { CodeRepo, StaringRepo } = require("../repositories");
const { Op, Sequelize } = require("sequelize");

class CodeQueryScopes {
  static repo = CodeRepo;

  filterByLanguage(language) {
    return {
      where: {
        language,
      },
    };
  }
  filterById(id) {
    return {
      where: {
        id,
      },
    };
  }
  filterByAuthorId(author_id) {
    return {
      where: {
        author_id,
      },
    };
  }
  searchOnTitleAndContent(search) {
    return {
      where: {
        [Op.or]: [
          { title: { [Op.like]: "%" + search + "%" } },
          { content: { [Op.like]: "%" + search + "%" } },
        ],
      },
    };
  }
  paginate(limit, offset) {
    return {
      limit,
      offset,
      order: [["created_datetime", "DESC"]],
    };
  }
  orderByStarsCount() {
    return {
      include: [{ model: StaringRepo.repo, as: "stars" }],
      group: ["stars.code_id"],
      order: [[Sequelize.fn("count", Sequelize.col("stars.user_id")), "DESC"]],
    };
  }
}

const CodeQueryBuilder = QueryBuilderMaker.make(CodeQueryScopes);

module.exports = CodeQueryBuilder;
