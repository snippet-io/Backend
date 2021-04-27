const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/database');
const { UserBuilder } = require('../../models/User');

class Repo extends Model { }
class UserRepo {
    static repo = Repo;

    static addScope() {
        return this.repo.addScope(...arguments);
    }
    static scope() {
        const instance = new this;
        instance.scopes = arguments;
        return instance;
    }
    
    async findAll(...args) {
        const user_entities = await UserRepo.repo.scope(...this.scopes).findAll(...Array.from(args));
        const users = user_entities.map(EntityToUser);
        return users;
    }

    async create(user, ...args) {
        await UserRepo.repo.scope(...this.scopes).create({
            id: user.getId()
        }, ...Array.from(args));
    }
}
function EntityToUser(entity) {
    return new UserBuilder(entity.id).build();
}

Repo.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize,
    tableName: 'user'
});

module.exports = UserRepo;