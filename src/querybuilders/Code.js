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
  filterByStaringByUser(user_id) {
    return {
      include: [{ model: StaringRepo.repo, as: "stars" }],
      where: {
        ["stars.user_id"]: user_id,
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
    };
  }
  orderByLatest() {
    return {
      order: [["created_datetime", "DESC"]],
    };
  }
  orderByStarsCount() {
    return {
      include: [
        {
          model: StaringRepo.repo,
          as: "stars",
          duplicating: false,
        },
      ],
      group: [Sequelize.col("id")],
      order: [
        [Sequelize.fn("count", Sequelize.col("user_id")), "DESC"],
        ["created_datetime", "DESC"],
      ],
    };
  }
}

const CodeQueryBuilder = QueryBuilderMaker.make(CodeQueryScopes);

module.exports = CodeQueryBuilder;
