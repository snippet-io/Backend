const UserRepo = require("./definitions/UserRepo");
const CodeRepo = require("./definitions/CodeRepo");
const StaringRepo = require("./definitions/StaringRepo");

UserRepo.repo.hasMany(CodeRepo.repo, {
  as: "codes",
  sourceKey: "id",
  foreignKey: "author_id",
});
CodeRepo.repo.belongsTo(UserRepo.repo, {
  sourceKey: "id",
  foreignKey: "author_id",
});

CodeRepo.repo.hasMany(StaringRepo.repo, {
  as: "stars",
  sourceKey: "id",
  foreignKey: "code_id",
});
StaringRepo.repo.belongsTo(CodeRepo.repo, {
  as: "stared_code",
  sourceKey: "id",
  foreignKey: "code_id",
});

module.exports = {
  UserRepo,
  CodeRepo,
  StaringRepo,
};
