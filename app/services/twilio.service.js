const models = require('../../database/models');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const url = require('url');
const UserService = require('../services/user.service');
const ClientCapability = require('twilio').jwt.ClientCapability;
class TwilioService {
    outboundCall() {
        try {
            client.calls.create({
                asyncAmd: "true",
                machineDetection: 'Enable',
                asyncAmdStatusCallback: 'http://c099c9b2e5b3.ngrok.io/api/twilio/amd',
                url: 'http://demo.twilio.com/docs/classic.mp3',
                from: process.env.TWILIO_NUMBER,
                to: "+12064658983"
            }).then(async call => {
                let conference = await models.conferences.findOne({
                    where: {
                        conferenceId: call.sid
                    }
                });

                if (!conference) {
                    conference = await models.conferences.create({
                        conferenceId: call.sid
                    });
                }
            }).catch(err => {
                console.log(err)
            });
        } catch (err) {
            throw err;
        }
    }

    async AMD(call, host) {
        try {
            if (call.AnsweredBy == "human") {
                const workerId = 3;

                const callbackUrl = this.connectConferenceUrl(host, workerId, call.CallSid);

                this.addWorkersToConference(workerId, callbackUrl);

                await models.conferences.update({
                    caller_id: workerId
                }, {
                    where: {
                        conferenceId: call.CallSid
                    }
                });
            } else {
                console.log("Send text with callback number");
            }
        } catch (err) {
            throw err;
        }
    }

    addWorkersToConference(agentId, callbackUrl) {
        client.calls.create({
            from: process.env.TWILIO_NUMBER,
            to: `client:${agentId}`,
            url: callbackUrl
        }).then(call => {
            console.log(call);
        }).catch(err => {
            console.log(err)
        });
    }

    connectConferenceUrl(host, agentId, conferenceId) {
        const pathName = `/twilio/conference/${conferenceId}/connect/${agentId}`;

        return url.format({
            protocol: 'https',
            host: host,
            pathname: pathName
        });
    };

    capabilityGenerator(agentId){
        let capability = new ClientCapability({
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN
        });

        capability.addScope(new ClientCapability.IncomingClientScope(agentId));

        return capability.toJwt();
    }
}

module.exports = new TwilioService;