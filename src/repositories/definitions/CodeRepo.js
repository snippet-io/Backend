const { Model, DataTypes, DatabaseError } = require('sequelize');
const { sequelize } = require('../../loaders/database');
const { CodeBuilder } = require('../../models/Code');

class Repo extends Model { }
class CodeRepo {
    static repo = Repo;
    
    static async findAll(transaction) {
        const code_entities = await this.repo.findAll({attributes: ['id', 'title', 'language', 'author_id'], transaction});
        const codes = code_entities.map(EntityToCode);
        return codes;
    }
    static async findById(id, transaction) {
        const code_entity = await this.repo.findByPk(id, {transaction});
        const code = EntityToCode(code_entity);
        return code;
    }
    static async create(code, transaction) {
        await this.repo.create(ModelToEntity(code), { transaction });
    }
}
function EntityToCode(entity) {
    return new CodeBuilder(entity.title, entity.language, entity.author_id)
        .setContent(entity.content)
        .setDescription(entity.description)
        .setId(entity.id)
        .build();
}
function ModelToEntity(model) {
    return {
        id: model.getId(),
        title: model.getTitle(),
        content: model.getContent(),
        language: model.getLanguage(),
        description: model.getDescription(),
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
    }
}, {
    sequelize,
    tableName: 'code'
});

module.exports = CodeRepo;