const Router = require("./");
const controller = require('../../controllers/CodeController');
const { AccessTokenExtractor } = require('../middlewares');

const router = new Router();

router.post('/', [AccessTokenExtractor], controller.createCode);

module.exports = router;