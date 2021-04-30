const QueryBuilderMaker = require("@yeoul/sequelize-querybuilder");
const { CodeRepo } = require("../repositories");
const StaringRepo = require("../repositories/definitions/StaringRepo");

class StaringQueryScopes {
    static repo = StaringRepo;

    includeStaredCode() {
        return {
            include: [
                { model: CodeRepo.repo, as: 'stared_code'}
            ]
        };
    }
}

const StaringQueryBuilder = QueryBuilderMaker.make(StaringQueryScopes);
module.exports = StaringQueryBuilder;