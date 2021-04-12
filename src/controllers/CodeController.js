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

    await CodeService.deleteCode(code_id);
};

module.exports = controllers;