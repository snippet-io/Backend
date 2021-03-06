const StaringService = require("../services/StaringService");
const controllers = {};

controllers.starCode = async (req) => {
  const user_id = req.auth.getUserId();
  const code_id = req.params.id;

  await StaringService.starCode(code_id, user_id);
};
controllers.unstarCode = async (req) => {
  const user_id = req.auth.getUserId();
  const code_id = req.params.id;

  await StaringService.unstarCode(code_id, user_id);
};
controllers.getStaredCodeByUser = async (req) => {
  const user_id = req.params.id;
  const { search, language, order } = req.query;
  return await StaringService.getStaredCodeByUser(user_id, {search, language, order});
};

module.exports = controllers;
