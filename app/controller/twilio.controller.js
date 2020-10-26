const TwilioService = require('../services/twilio.service');
const twilioGeneratorService = require("../services/twilio-generator.service");

class TwilioController {
    outboundCall(req, res) {
        TwilioService.outboundCall();
        return res.sendStatus(200);
    }

    async AMD(req, res) {
        await TwilioService.AMD(req.body, req.get('host'));
        return res.sendStatus(200);
    }

    token(req, res) {
        let token = TwilioService.capabilityGenerator(req.params.workerId);

        res.set('Content-Type', 'application/jwt');
        return res.send(token);
    }

    connectToConference(req, res) {
        res.type('text/xml');
        res.send(twilioGeneratorService.connectConferenceTwiml({
            conferenceId: req.params.conferenceId,
            waitUrl: "http://twimlets.com/holdmusic?Bucket=com.twilio.music.classical",
            startConferenceOnEnter: true,
            endConferenceOnExit: true
        }).toString());
    }
}

module.exports = new TwilioController;