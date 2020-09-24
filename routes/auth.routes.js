const router = require('express').Router();
const { login, verify } = require('../app/controller/auth.controller');
const { checkBannedAccount } = require('../app/middleware/auth.middleware');

router.post('/signin', checkBannedAccount, login);
router.post('/verify', verify);

module.exports = router;