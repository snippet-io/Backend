const Router = require("./");
const controllers = require('../../controllers/UserController');
const { AccessTokenExtractor } = require('../middlewares');

const router = new Router();

router.get('/:id/codes', [AccessTokenExtractor], controllers.getCodesOfUser);
router.get('/:id', controllers.getUser);

module.exports = router;