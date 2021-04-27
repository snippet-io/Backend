const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/database');
const { UserBuilder } = require('../../models/User');
const CustomRepo = require('./CustomRepo');

class Repo extends Model { }
class UserRepo extends CustomRepo{
    static repo = Repo;

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