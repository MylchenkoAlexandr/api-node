const router = require('express').Router();
const TwilioController = require('../app/controller/twilio.controller');

router.post('/outbound-call', TwilioController.outboundCall);
router.post('/amd', TwilioController.AMD);
router.post('/token/:workerId', TwilioController.token);
router.post('/conference/:conferenceId/connect/3', TwilioController.connectToConference);

module.exports = router;