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
                    // url: 'http://demo.twilio.com/docs/classic.mp3',
                    twiml: '<Response><Say>Hello it`s Blueberry. Please call this number: 11111111111</Say></Response>',
                    from: process.env.TWILIO_NUMBER,
                    // TODO change to varible customerPhone
                    to: "+13108769581"
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

    async machineDetection(call, host) {
        try {
            if (call.AnsweredBy == "human") {
                const workerId = 3;

                const callSid = call.CallSid;

                const callbackUrl = TwilioService.generateConnectConferenceUrl(host, workerId, callSid);
                
                console.log("AutoDiallerService -> machineDetection -> callbackUrl", callbackUrl);

                TwilioService.updateCallUrl(callSid, callbackUrl);

                TwilioService.addWorkersToConference(workerId, callbackUrl);
            }
        } catch (err) {
            throw err;
        }
    }

    async addAgentToCall(host) {
        try {
            const workerId = 1;

            // const existCall = await models.conferences.findOne({
            //     where: {
            //         caller_id: 3
            //     }
            // });

            const callSid = "CA9c55dc4dd58ffb01cadccf9d79767eac";

            const callbackUrl = TwilioService.generateConnectConferenceUrl(host, workerId, callSid);

            TwilioService.updateCallUrl(callSid, callbackUrl);

            TwilioService.addWorkersToConference(workerId, callbackUrl);
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new AutoDiallerService;