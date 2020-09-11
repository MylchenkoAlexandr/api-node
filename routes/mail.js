const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/auth.middleware');
const { sendMailToClient } = require('../app/controller/mailController');

router.post('/send', sendMailToClient);

module.exports = router;