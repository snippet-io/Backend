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