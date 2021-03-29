const UserRepo = require('./definitions/UserRepo');
const ProjectRepo = require('./definitions/ProjectRepo');
const ComponentRepo = require('./definitions/ComponentRepo');

UserRepo.hasMany(ComponentRepo, {foreignKey: 'manager', sourceKey: 'id'});
ComponentRepo.belongsTo(UserRepo, {foreignKey: 'manager', sourceKey: 'id'});

ProjectRepo.hasMany(ComponentRepo, {foreignKey: 'project_id', sourceKey: 'id'});
ComponentRepo.belongsTo(ProjectRepo, {foreignKey: 'project_id', sourceKey: 'id'});

module.exports = {
    UserRepo,
    ProjectRepo,
    ComponentRepo,
}