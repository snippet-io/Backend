const { BadRequest } = require("../errors/HttpException");
const CodeService = require("../services/CodeService");
const { CodeBuilder } = require("../models/Code");
const { AccessToken } = require("../authentication");
const controllers = {};

const Joi = require("joi");

controllers.createCode = async (req, res) => {
  const access_token = req.auth;
  const { title, content, language, description } = req.body;
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    language: Joi.string().required(),
    description: Joi.string(),
  });
  if (schema.validate(req.body).error) {
    throw new BadRequest();
  }

  const new_code = new CodeBuilder(title, language, access_token.getUserId())
    .setContent(content)
    .setDescription(description)
    .build();

  await CodeService.createCode(new_code);
  res.status(201);
};
controllers.deleteCode = async (req) => {
  const schema = Joi.object({ id: Joi.number().required() });
  if (schema.validate(req.params).error) {
    throw new BadRequest();
  }

  const code_id = req.params.id;
  const auth_id = req.auth.getUserId();

  await CodeService.deleteCode(code_id, auth_id);
};
controllers.modifyCode = async (req) => {
  const schema = Joi.object({
    params: Joi.object({
      id: Joi.number().required(),
    }),
    body: Joi.object({
      title: Joi.string().required(),
      content: Joi.string().required(),
      language: Joi.string().required(),
      description: Joi.string(),
    }),
  });

  if (schema.validate({ params: req.params, body: req.body }).error) {
    throw new BadRequest();
  }

  const access_token = req.auth;
  const code_id = req.params.id;
  const code_data = req.body;

  const modified_code = new CodeBuilder(
    code_data.title,
    code_data.language,
    access_token.getUserId()
  )
    .setContent(code_data.content)
    .setDescription(code_data.description)
    .setId(code_id)
    .build();

  await CodeService.modifyCode(modified_code);
};
controllers.getCodes = async (req) => {
  const schema = Joi.object({
    limit: Joi.number().required(),
    offset: Joi.number().required(),
    search: Joi.string(),
    language: Joi.string(),
  });

  if (schema.validate(req.query).error) {
    throw new BadRequest();
  }

  const { limit, offset, search, language } = req.query;

  return await CodeService.getCodes({
    language,
    search,
    pagination: { limit: Number(limit), offset: Number(offset) },
  });
};
controllers.getCode = async (req) => {
  const id = req.params.id;

  const schema = Joi.object({
    id: Joi.number().required(),
  });
  if (schema.validate(req.params).error) {
    throw new BadRequest();
  }
  return await CodeService.getCode(id);
};

module.exports = controllers;
