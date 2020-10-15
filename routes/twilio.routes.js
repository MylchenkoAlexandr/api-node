const router = require('express').Router();
const TwilioController = require('../app/controller/twilio.controller');

router.post('/outbound-call', TwilioController.outboundCall);
router.post('/amd', TwilioController.AMD);

module.exports = router;