const models = require('../../database/models');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const url = require('url');
const UserService = require('../services/user.service');
const ClientCapability = require('twilio').jwt.ClientCapability;
class TwilioService {
    redirectCall(callSid, toPhone) {
        try {
            client.calls(callSid).update({
                to: toPhone
            });
        } catch (error) {
            throw error;
        }
    }

    addWorkersToConference(agentId, callbackUrl) {
        try {
            client.calls.create({
                from: process.env.TWILIO_NUMBER,
                to: `client:${agentId}`,
                url: callbackUrl
            }).catch(err => {
                console.error(err)
            });
        } catch (error) {
            throw error;
        }
    }

    updateCallUrl(callSid, callbackUrl) {
        client.calls(callSid).update({
            method: 'POST',
            url: callbackUrl
        }).catch(err => {
            console.log(err)
        });
    }

    generateConnectConferenceUrl(agentId, conferenceId) {
        return `${process.env.CALLBACK_TWILIO}/api/twilio/conference/${conferenceId}/connect/${agentId}`;
    };

    genereteCapabilityToken(agentId) {
        const capability = new ClientCapability({
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN
        });

        capability.addScope(new ClientCapability.IncomingClientScope(agentId));

        const token = capability.toJwt();

        return token;
    }
}

module.exports = new TwilioService;