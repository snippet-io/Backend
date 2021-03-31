const { Router } = require("express");
const controller = require('../../controllers/AuthController');

const router = Router();

router.get('/login', controller.login);
router.get('/accesstoken', controller.issueAccessToken);

module.exports = router;