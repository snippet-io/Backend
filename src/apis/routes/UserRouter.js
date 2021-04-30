const Router = require("./");
const controllers = require('../../controllers/UserController');
const staring_controllers = require('../../controllers/StaringController');
const { AccessTokenExtractor } = require('../middlewares');

const router = new Router();

router.get('/:id/codes', [AccessTokenExtractor], controllers.getCodesOfUser);
router.get('/:id', controllers.getUser);
router.get('/:id/staring/codes', staring_controllers.getStaredCodeByUser);

module.exports = router;