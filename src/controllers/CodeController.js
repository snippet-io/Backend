const { BadRequest } = require('../errors/HttpException');
const CodeService = require('../services/CodeService');
const { CodeBuilder } = require('../models/Code');
const { AccessToken } = require('../authentication');
const controllers = {};

controllers.createCode = async (req, res) => {
    const access_token = req.auth;
    const { title, content, language, description } = req.body;

    if( !title || !content || !language) {
        throw new BadRequest;
    }

    const new_code = new CodeBuilder(title, language, access_token.getUserId()).setContent(content).setDescription(description).build();

    await CodeService.createCode(new_code);
    res.status(201);
};
controllers.deleteCode = async (req) => {
    const code_id = req.params.id;
    const auth_id = req.auth.getUserId();

    await CodeService.deleteCode(code_id, auth_id);
};
controllers.modifyCode = async (req) => {
    const access_token = req.auth;
    const code_id = req.params.id;
    const code_data = req.body;

    const modified_code = new CodeBuilder(code_data.title, code_data.language, access_token.getUserId())
        .setContent(code_data.content)
        .setDescription(code_data.description)
        .setId(code_id)
        .build();

    await CodeService.modifyCode(modified_code);
};
controllers.getCodes = async (req) => {
    const { limit, offset } = req.query;

    return await CodeService.getCodes(limit, offset);
};
controllers.getCode = async (req) => {
    const id = req.params.id;

    return await CodeService.getCode(id);
};

module.exports = controllers;