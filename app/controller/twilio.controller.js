const TwilioService = require('../services/twilio.service');
const twilioGeneratorService = require("../services/twilio-generator.service");
const AutoDiallerService = require("../services/autodialler.service");
const AutoDiallerFacade = require("../facades/autodialler.facade")
const UserRepository = require('../repository/user.repository');
const _ = require('lodash');

class TwilioController {
    outboundCall(req, res) {
        AutoDiallerService.outboundCall('', '');
        return res.sendStatus(200);
    }

    async AMD(req, res) {
        await AutoDiallerService.machineDetection(req.body);
        return res.sendStatus(200);
    }

    async addWorkerToTheCall(req, res) {
        await AutoDiallerService.addAgentToCall(req.body.guide_id);
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

    async callSelectedByAutoDialer(req, res) {
        try {
            if (!_.isEmpty(req.body.leads)) {
                let guides = await UserRepository.findSuitableWorker("guide");
                
                if (!guides) {
                    return res.status(202).json({ status: 'error', message: "No agents online" });
                }

                const response = await AutoDiallerFacade.callLeads(req.body.leads);
                
                return res.status(response.code).json({ status: response.status, message: response.message });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error!" });
            throw error;
        }
    }
}

module.exports = new TwilioController;