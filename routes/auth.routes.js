const router = require('express').Router();
const { login, verify } = require('../app/controller/auth.controller');
const AuthMiddleware = require('../app/middleware/auth.middleware');
const checkBannedAccount = AuthMiddleware.checkBannedAccount;

router.post('/signin', checkBannedAccount, login);
router.post('/verify', verify);

module.exports = router;