const router = require('express').Router();
const TwilioController = require('../app/controller/twilio.controller');
const twilioGeneratorService = require("../app/services/twilio-generator.service");
router.post('/outbound-call', TwilioController.outboundCall);
router.post('/amd', TwilioController.AMD);
router.post('/token/:workerId', TwilioController.token);

router.post('/:conferenceId/connect/3', function (req, res) {
    res.type('text/xml');
    res.send(twilioGeneratorService.twimlGenerator.connectConferenceTwiml({
        conferenceId: req.params.conferenceId,
        waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
        startConferenceOnEnter: true,
        endConferenceOnExit: true
    }).toString());
});

module.exports = router;