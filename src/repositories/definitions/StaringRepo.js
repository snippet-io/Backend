const { Model, DataTypes } = require("sequelize");
const { sequelize } = require('../../loaders/database');
const CustomRepo = require("./CustomRepo");

class Repo extends Model{ }

class StaringRepo extends CustomRepo {
    static repo = Repo;

    async findAll(...args) {
        const starings = await StaringRepo.repo.scope(...this.scopes).findAll(...Array.from(args));
        return starings.map(EntityToStaring);
    }
    async create(staring, ...args) {
        await StaringRepo.repo.scope(...this.scopes).create({code_id: staring.code_id, user_id: staring.user_id}, ...Array.from(args));
    }
    async destroy(staring, option) {
        const number_of_destoryed = await StaringRepo.repo.scope(...this.scopes).destroy({
            where: {
                code_id: staring.code_id,
                user_id: staring.user_id
            },
            transaction: option.transaction
        });

        return number_of_destoryed;
    }
    async count(...args) {
        const number = await StaringRepo.repo.scope(...this.scopes).count(...args);
        return number;
    }
}

function EntityToStaring(entity) {
    return {
        code_id: entity.code_id,
        user_id: entity.user_id
    };
}

Repo.init({
   code_id: {
       type: DataTypes.INTEGER,
       allowNull: false,
       primaryKey: true
   },
   user_id: {
       type: DataTypes.INTEGER,
       allowNull: false,
       primaryKey: false
   }
}, {
    sequelize,
    tableName: 'staring'
});

module.exports = StaringRepo;