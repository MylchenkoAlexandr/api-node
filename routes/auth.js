const router = require('express').Router();
const { login, registration } = require('../app/controller/authController');

router.post('/login', login);
router.post('/registration', registration);

module.exports = router;