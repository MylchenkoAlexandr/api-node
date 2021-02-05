const router = require('express').Router();

const TemplatesController = require("../app/controller/templates.controller");

router.get('/sms/:user_id', TemplatesController.getSmsTemplates);
router.get('/emails/:user_id', TemplatesController.getEmailTemplates);
router.post('/sms/send', TemplatesController.sendSms);
router.post('/sms/create', TemplatesController.createSmsTemplate);
router.post('/sms/update', TemplatesController.updateSmsTemplate);
router.post('/sms/remove', TemplatesController.removeSmsTemplate);
router.post('/email/send', TemplatesController.sendEmail);
router.post('/email/create', TemplatesController.createEmailTemplate);
router.post('/email/update', TemplatesController.updateEmailTemplate);
router.post('/email/remove', TemplatesController.removeEmailTemplate);

module.exports = router;