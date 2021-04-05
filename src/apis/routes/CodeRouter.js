const Router = require("./");
const controller = require('../../controllers/CodeController');

const router = new Router();

router.post('/', controller.createCode);

module.exports = router;