const models = require('../../database/models');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const url = require('url');
const UserService = require('../services/user.service');
class TwilioService {
    outboundCall() {
        try {
            client.calls.create({
                asyncAmd: "true",
                machineDetection: 'Enable',
                asyncAmdStatusCallback: 'https://d8de2eece5ab.ngrok.io/api/twilio/amd',
                url: 'http://demo.twilio.com/docs/classic.mp3',
                from: process.env.TWILIO_NUMBER,
                to: "+13108769581"
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
                const workerId = await UserService.findSuitableWorker("guide");

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
        }).catch(err => {
            console.log(err)
        });
    }

    connectConferenceUrl(host, agentId, conferenceId) {
        const pathName = `/conference/${conferenceId}/connect/${agentId}`;

        return url.format({
            protocol: 'https',
            host: host,
            pathname: pathName
        });
    };
}

module.exports = new TwilioService;