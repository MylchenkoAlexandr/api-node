const TwilioService = require('../services/twilio.service');
const twilioGeneratorService = require("../services/twilio-generator.service");
const AutoDiallerService = require("../services/autodialler.service");

class TwilioController {
    outboundCall(req, res) {
        AutoDiallerService.outboundCall('', '');
        return res.sendStatus(200);
    }

    async AMD(req, res) {
        await AutoDiallerService.machineDetection(req.body, req.get('host'));
        return res.sendStatus(200);
    }

    async addWorkerToTheCall(req, res) {
        await AutoDiallerService.addAgentToCall(req.get('host'));
        return res.sendStatus(200);
    }

    token(req, res) {
        const token = TwilioService.genereteCapabilityToken(req.params.workerId);
        return res.set('Content-Type', 'application/jwt').send(token);
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