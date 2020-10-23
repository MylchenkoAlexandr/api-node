const router = require('express').Router();
const { sendMailToClient, createToken, getAllMailsByLead } = require('../app/controller/mail.controller');

router.post('/:lead_id/:user_id/send', sendMailToClient);
router.get('/:lead_id/all', getAllMailsByLead);
router.post('/create', createToken);

module.exports = router;