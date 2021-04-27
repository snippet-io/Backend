const UserRepo = require('./definitions/UserRepo');
const CodeRepo = require('./definitions/CodeRepo');

UserRepo.repo.hasMany(CodeRepo.repo, {as: 'codes', sourceKey: 'id', foreignKey: 'author_id'});
CodeRepo.repo.belongsTo(UserRepo.repo, {sourceKey: 'id', foreignKey: 'author_id'});

module.exports = {
    UserRepo,
    CodeRepo
};