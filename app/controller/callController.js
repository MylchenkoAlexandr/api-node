const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;

function token(req, res) {
    const capability = new ClientCapability({
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN
    });

    capability.addScope(
        new ClientCapability.OutgoingClientScope({
            applicationSid: process.env.TWILIO_TWIML_APP_SID
        })
    );

    const token = capability.toJwt();

    return res.status(200).json({ token });
}

function voice(req, res) {
    const voiceResponse = new VoiceResponse();

    voiceResponse.dial({
        record: 'record-from-answer-dual',
        callerId: process.env.TWILIO_NUMBER,
    }, req.body.number);

    return res.type('text/xml').send(voiceResponse.toString());
}

function recordCallback(req, res) {
    return res.sed(req.body);
}

module.exports = {
    token,
    voice,
    recordCallback
}