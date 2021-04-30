const QueryBuilderMaker = require("@yeoul/sequelize-querybuilder");
const { CodeRepo } = require("../repositories");
const StaringRepo = require("../repositories/definitions/StaringRepo");

class StaringQueryScopes {
    static repo = StaringRepo;

    filterByUser(user_id) {
        return {
            where: {
                user_id
            }
        };
    }
    filterByCode(code_id) {
        return {
            where: {
                code_id
            }
        };
    }
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