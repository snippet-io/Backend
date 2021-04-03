const Router = require("./");
const controller = require('../../controllers/AuthController');

const router = new Router();

router.get('/login', controller.login);
router.post('/accesstoken', controller.issueAccessToken);

module.exports = router;