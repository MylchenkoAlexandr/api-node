const router = require('express').Router();

const AuthMiddleware = require('../app/middleware/auth.middleware');

const checkBannedAccount = AuthMiddleware.checkBannedAccount;
const { login, verify } = require('../app/controller/auth.controller');

router.post('/signin', checkBannedAccount, login);
router.post('/verify', verify);

module.exports = router;