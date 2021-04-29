const StaringService = require('../services/StaringService');
const controllers = {};


controllers.starCode = async (req) => {
    const user_id = req.auth.getUserId();
    const code_id = req.params.id;

    await StaringService.starCode(code_id, user_id);
};

module.exports = controllers;