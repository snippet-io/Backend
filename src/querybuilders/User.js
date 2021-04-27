const QueryBuilderMaker = require('@yeoul/sequelize-querybuilder');
const { UserRepo, CodeRepo } = require('../repositories');
const { Op } = require('sequelize');

class UserQueryScopes {
    static repo = UserRepo;

    includeCode() {
        return {
            include: [
                { model: CodeRepo.repo, as: 'codes' }
              ]
        };
    }
}


const UserQueryBuilder = QueryBuilderMaker.make(UserQueryScopes);

module.exports = UserQueryBuilder;