const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const models = require('../../database/models');
const TwilioService = require('./twilio.service');

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
                    to: "+380632796212"
                    // to: "+13108769581"
                })
                .then(async call => {
                    await models.conferences.create({
                        conferenceId: call.sid
                        // TODO Add lead_id to this table
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
                const workerId = 3;

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

    async addAgentToCall() {
        try {
            const workerId = 1;

            const existCall = await models.conferences.findOne({
                where: {
                    caller_id: 3
                }
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