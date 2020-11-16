const router = require('express').Router();
const TwilioController = require('../app/controller/twilio.controller');

router.post('/outbound-call', TwilioController.outboundCall);
// router.post('/amd', TwilioController.AMD);
router.post('/answered', TwilioController.answeredCallBack);
router.post('/token/:workerId', TwilioController.token);
router.post('/conference/:conferenceId/connect/:id', TwilioController.connectToConference);
router.post('/addworker', TwilioController.addWorkerToTheCall);

router.post('/call/autodialer', TwilioController.callSelectedByAutoDialer);

module.exports = router;