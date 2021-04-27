const QueryBuilderMaker = require('@yeoul/sequelize-querybuilder');
const { UserRepo } = require('../repositories');
const { Op } = require('sequelize');

class UserQueryScopes {
    static repo = UserRepo;
}


const UserQueryBuilder = QueryBuilderMaker.make(UserQueryScopes);

module.exports = UserQueryBuilder;