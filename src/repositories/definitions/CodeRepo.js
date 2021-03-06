const { Model, DataTypes, DatabaseError, Op } = require('sequelize');
const { NotFound, Forbidden } = require('../../errors/HttpException');
const { sequelize } = require('../../loaders/database');
const { CodeBuilder } = require('../../models/Code');
const Option = require('js-option');
const ServiceTime = require('../../utils/ServiceTime');
const CustomRepo = require('./CustomRepo');

class Repo extends Model { }
class CodeRepo extends CustomRepo{
    static repo = Repo;
    
    async findAll(...args) {
        const code_entities = await CodeRepo.repo.scope(...this.scopes).findAll(...Array.from(args));
        const codes = code_entities.map(EntityToCode);
        return codes;
    }
    async findByPk(id, ...args) {
        const code_entity = await CodeRepo.repo.findByPk(id, ...Array.from(args));
        const code = code_entity? Option.some(EntityToCode(code_entity)) : Option.none;
        return code;
    }
    async create(code, ...args) {
        await CodeRepo.repo.scope(...this.scopes).create(ModelToEntity(code), ...Array.from(args));
    }
    async update(code, option) {
        const [ number_of_modified ] = await CodeRepo.repo.scope(...this.scopes).update(ModelToEntity(code), {
            where: {
               id: code.getId()
            },
            transaction: option.transaction
        })
        return number_of_modified;
    } 
    async destroy(code_id, option){
        const number_of_destroyed = await CodeRepo.repo.scope(...this.scopes).destroy({
            where: {
                id: code_id
            },
            transaction: option.transaction
        });
        return number_of_destroyed;
    }
}
function EntityToCode(entity) {
    return new CodeBuilder(entity.title, entity.language, entity.author_id)
        .setContent(entity.content)
        .setDescription(entity.description || undefined)
        .setId(entity.id)
        .setCreatedDatetime(new ServiceTime(entity.created_datetime))
        .build();
}
function ModelToEntity(model) {
    return {
        id: model.getId(),
        title: model.getTitle(),
        content: model.getContent(),
        language: model.getLanguage(),
        description: model.getDescription() || null,
        author_id: model.getAuthorId(),
    }
}

Repo.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT(65535),
        allowNull: false
    },
    language: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT(65535),
        allowNull:true
    },
    author_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_datetime: {
        type: DataTypes.DATE,
    }
}, {
    sequelize,
    tableName: 'code'
});

module.exports = CodeRepo;