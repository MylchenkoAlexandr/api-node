const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const models = require('../../database/models');
const TwilioService = require('./twilio.service');
const UserService = require('../services/user.service');

class AutoDiallerService {
    outboundCall(customerPhone, lead_id) {
        try {
            client.calls
                .create({
                    asyncAmd: "true",
                    machineDetection: 'Enable',
                    asyncAmdStatusCallback: process.env.CALLBACK_TWILIO + '/api/twilio/amd',
                    url: 'http://demo.twilio.com/docs/classic.mp3',
                    from: process.env.TWILIO_NUMBER,
                    // TODO change to varible customerPhone
                    // to: "+380632796212"
                    to: "+13108769581"
                })
                .then(async call => {
                    await models.conferences.create({
                        conferenceId: call.sid
                    });
                })
                .catch(err => console.error(err));
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
                    caller_id: workerId
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
                    caller_id: guide_id
                },
                order: [['createdAt', 'DESC']],
            });

            const callSid = existCall.conferenceId;

            const callbackUrl = TwilioService.generateConnectConferenceUrl(workerId, callSid);

            TwilioService.updateCallUrl(callSid, callbackUrl);

            TwilioService.addWorkersToConference(workerId, callbackUrl);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AutoDiallerService;
