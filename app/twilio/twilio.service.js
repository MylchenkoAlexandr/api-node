const ClientCapability = require('twilio').jwt.ClientCapability;

class TwilioService {
    genereteCapabilityToken(agentId) {
        let capability = new ClientCapability({
            accountSid: process.env.TWILIO_ACCOUNT_SID,
            authToken: process.env.TWILIO_AUTH_TOKEN,
            ttl: 43200
        });

        capability.addScope(new ClientCapability.IncomingClientScope(agentId));
        capability.addScope(new ClientCapability.OutgoingClientScope({ applicationSid: process.env.TWILIO_TWIML_APP_SID, clientName: agentId }));

        const token = capability.toJwt();

        return token;
    }
}

module.exports = new TwilioService;