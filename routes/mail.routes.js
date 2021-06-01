const router = require('express').Router();
const MailController = require('../app/controller/mail.controller');

router.post('/:lead_id/:user_id/send', MailController.sendMailToClient);
router.get('/:lead_id/all', MailController.getAllMailsByLead);
router.post('/authCode', MailController.getAuthCode);
router.post('/createToken', MailController.createToken);

module.exports = router;