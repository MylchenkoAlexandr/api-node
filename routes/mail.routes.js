const router = require('express').Router();
const { authenticateToken } = require('../app/middleware/auth.middleware');
const { sendMailToClient, createToken } = require('../app/controller/mail.controller');

router.post('/send', sendMailToClient);
router.post('/create', createToken);

module.exports = router;