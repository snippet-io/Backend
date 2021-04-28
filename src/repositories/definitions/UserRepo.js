const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/database');
const { CodeBuilder } = require('../../models/Code');
const { UserBuilder } = require('../../models/User');
const ServiceTime = require('../../utils/ServiceTime');
const CustomRepo = require('./CustomRepo');

class Repo extends Model { }
class UserRepo extends CustomRepo{
    static repo = Repo;

    async findAll(...args) {
        const user_entities = await UserRepo.repo.scope(...this.scopes).findAll(...Array.from(args));
        const users = user_entities.map(EntityToUser);
        return users;
    }

    async findByPk(id, ...args) {
        const user_entity = await UserRepo.repo.scope(...this.scopes).findByPk(id, ...Array.from(args));
        const user = EntityToUser(user_entity);
        return user;
    }
    async create(user, ...args) {
        await UserRepo.repo.scope(...this.scopes).create(UserToEntity(user), ...Array.from(args));
    }
    async upsert(user, ...args) {
        await UserRepo.repo.scope(...this.scopes).upsert(UserToEntity(user), ...Array.from(args));
    }
}
function EntityToUser(entity) {
    const user = new UserBuilder(entity.id, entity.name).build();
    if(entity.codes) {
        entity.codes.forEach(code_entity => {
            user.addCode(EntityToCode(code_entity));
        });
    }
    return user;
}
function UserToEntity(user) {
    return {
        id: user.getId(),
        name: user.getName()
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
Repo.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'user'
});

module.exports = UserRepo;