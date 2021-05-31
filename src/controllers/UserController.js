const { BadRequest } = require("../errors/HttpException");
const UserService = require("../services/UserService");
const controllers = {};

const Joi = require("joi");

controllers.getCodesOfUser = async (req) => {
  const user_id = req.params.id;
  const { search, language, order } = req.query;

  return await UserService.getCodesOfUser(user_id, {
    language,
    search,
    order,
  });
};
controllers.getUser = async (req) => {
  const user_id = req.params.id;

  return await UserService.getUser(user_id);
};

module.exports = controllers;
