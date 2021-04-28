const QueryBuilderMaker = require("@yeoul/sequelize-querybuilder");
const StaringRepo = require("../repositories/definitions/StaringRepo");

class StaringQueryScopes {
    static repo = StaringRepo;
}

const StaringQueryBuilder = QueryBuilderMaker.make(StaringQueryScopes);
module.exports = StaringQueryBuilder;