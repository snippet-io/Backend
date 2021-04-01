const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../../loaders/database');
const { UserBuilder } = require('../../models/User');

class Repo extends Model { }
class UserRepo {
    static repo = Repo;
    
    static async findAll(transaction) {
        const user_entities = await this.repo.findAll({transaction});
        const users = user_entities.map(EntityToUser);
        return users;
    }

    static async create(user, transaction) {
        await this.repo.create({
            id: user.getId()
        }, { transaction });
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