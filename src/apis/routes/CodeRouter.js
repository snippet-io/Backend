const Router = require("./");
const controller = require('../../controllers/CodeController');
const { AccessTokenExtractor } = require('../middlewares');
const controllers = require("../../controllers/CodeController");
const staring_controllers = require('../../controllers/StaringController');

const router = new Router();

router.post('/', [AccessTokenExtractor], controller.createCode);
router.delete('/:id', [AccessTokenExtractor], controller.deleteCode);
router.put('/:id', [AccessTokenExtractor], controllers.modifyCode);
router.get('/', controllers.getCodes);
router.post('/:id/stars', [AccessTokenExtractor], staring_controllers.starCode);

module.exports = router;