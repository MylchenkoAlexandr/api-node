const router = require('express').Router();
const { login, verify } = require('../app/controller/authController');
const { checkBannedAccount } = require('../app/middleware/ban.middleware');

router.post('/signin', checkBannedAccount, login);
router.post('/verify', checkBannedAccount, verify);

module.exports = router;