const router = require('express').Router();
const { login, verify } = require('../app/controller/auth.controller');

router.post('/signin', login);
router.post('/verify', verify);

module.exports = router;