const QueryBuilderMaker = require('@yeoul/sequelize-querybuilder');
const { CodeRepo } = require('../repositories');
const { Op } = require('sequelize');

class CodeQueryScopes {
    static repo = CodeRepo;

    filterByLanguage(language) {
        return {
            where: {
                language
            }
        };
    }
    filterById(id) {
        return {
            where: {
                id
            }
        };
    }
    filterByAuthorId(author_id) {
        return {
            where: {
                author_id
            }
        };
    }
    searchOnTitleAndContent(search) {
        return {
            where: {
                [Op.or]: [ 
                    { title: { [Op.like]: '%'+search+'%'}}, 
                    { content: { [Op.like]: '%'+search+'%'}}
                ]
            }
        };
    }
    paginate(limit, offset) {
        return {
            limit,
            offset
        };
    }
}


const CodeQueryBuilder = QueryBuilderMaker.make(CodeQueryScopes);

module.exports = CodeQueryBuilder;