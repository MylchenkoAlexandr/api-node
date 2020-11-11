const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const models = require('../../database/models');
const TwilioService = require('./twilio.service');
const UserService = require('../services/user.service');
const ConferenceRepository = require('../repository/conference.repository');
const UserRepository = require('../repository/user.repository');
const _ = require('lodash');

class AutoDiallerService {
    async outboundCall(customerPhone, lead_id) {
        try {
            const guides = await UserRepository.findSuitableWorker("guide");

            if (!_.isEmpty(guides)) {
                client.calls
                    .create({
                        asyncAmd: "true",
                        machineDetection: 'Enable',
                        asyncAmdStatusCallback: process.env.CALLBACK_TWILIO + '/api/twilio/amd',
                        url: 'http://demo.twilio.com/docs/classic.mp3',
                        from: process.env.TWILIO_NUMBER,
                        to: customerPhone
                    })
                    .then(async call => {
                        await models.conferences.create({
                            lead_id: lead_id,
                            conferenceId: call.sid
                        });
                    })
                    .catch(err => console.error(err));
            }
        } catch (err) {
            throw err;
        }
    }

    async machineDetection(call) {
        try {
            if (call.AnsweredBy == "human") {
                const workerId = await UserService.findSuitableWorker("guide");

                const callSid = call.CallSid;

                const callbackUrl = TwilioService.generateConnectConferenceUrl(workerId, callSid);

                await models.conferences.update({
                    guide_id: workerId
                }, {
                    where: {
                        conferenceId: callSid
                    }
                });

                TwilioService.updateCallUrl(callSid, callbackUrl);

                TwilioService.addWorkersToConference(workerId, callbackUrl);
            }
        } catch (err) {
            throw err;
        }
    }

    async addAgentToCall(guide_id) {
        try {
            const workerId = await UserService.findSuitableWorker("agent");

            const existCall = await models.conferences.findOne({
                where: {
                    guide_id: guide_id
                },
                order: [['createdAt', 'DESC']],
            });

            await existCall.update({
                agent_id: workerId
            });

            const callSid = existCall.conferenceId;

            const callbackUrl = TwilioService.generateConnectConferenceUrl(workerId, callSid);

            TwilioService.updateCallUrl(callSid, callbackUrl);

            TwilioService.addWorkersToConference(workerId, callbackUrl);
        } catch (err) {
            throw err;
        }
    }

    async getLeadIdFromCall(field, id) {
        try {
            const leadId = await ConferenceRepository.getLeadIdFromCall(field, id);
            return leadId;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AutoDiallerService;
