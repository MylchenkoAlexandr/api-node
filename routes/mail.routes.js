const router = require('express').Router();
const { sendMailToClient, createToken, } = require('../app/controller/mail.controller');

router.post('/send', sendMailToClient);
router.post('/create', createToken);

module.exports = router;