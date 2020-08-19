const router = require('express').Router();
const { sendMailToClient } = require('../app/controller/mailController');

router.post('/send', sendMailToClient);

module.exports = router;