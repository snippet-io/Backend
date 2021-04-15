const { Model, DataTypes, DatabaseError, Op } = require('sequelize');
const { NotFound, Forbidden } = require('../../errors/HttpException');
const { sequelize } = require('../../loaders/database');
const { CodeBuilder } = require('../../models/Code');
const Option = require('../../utils/option');

class Repo extends Model { }
class CodeRepo {
    static repo = Repo;
    
    static async findAll(transaction) {
        const code_entities = await this.repo.findAll({transaction});
        const codes = code_entities.map(EntityToCode);
        return codes;
    }
    static async findById(id, transaction) {
        const code_entity = await this.repo.findByPk(id, {transaction});
        const code = code_entity? Option.some(EntityToCode(code_entity)) : Option.none;
        return code;
    }
    static async create(code, transaction) {
        await this.repo.create(ModelToEntity(code), { transaction });
    }
    static async update(code, transaction) {
        const [ number_of_modified ] = await this.repo.update(ModelToEntity(code), {
            where: {
                [Op.and]: [{id: code.getId()}, {author_id: code.getAuthorId()}]
            },
            transaction
        })
        if(number_of_modified <= 0) {
            throw new Forbidden;
        }
    }
    static async delete(code_id, transaction){
        const number_of_destroyed = await this.repo.destroy({
            where: {
                id: code_id
            },
            transaction
        });
        if (number_of_destroyed <= 0) {
            throw new NotFound;
        }
    }
    static async findByAuthorId(author_id, transaction) {
        const code_entities = await this.repo.findAll({
            where: {
                author_id: author_id
            },
            transaction
        });

        const codes = code_entities.map(entity => EntityToCode(entity));
        return codes;
    }
}
function EntityToCode(entity) {
    return new CodeBuilder(entity.title, entity.language, entity.author_id)
        .setContent(entity.content || undefined)
        .setDescription(entity.description || undefined)
        .setId(entity.id)
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
    }
}, {
    sequelize,
    tableName: 'code'
});

module.exports = CodeRepo;