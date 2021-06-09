const router = require('express').Router();
const AuthController = require('../app/controller/auth.controller');

router.post('/signin', AuthController.login);
router.post('/verify', AuthController.verify);

module.exports = router;