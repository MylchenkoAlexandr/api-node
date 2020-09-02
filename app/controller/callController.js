const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;
const models = require('../../database/models')

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
        recordingStatusCallbackEvent: "completed",
        recordingStatusCallback: `${process.env.CALLBACK_TWILIO}/api/call/record-callback/${req.body.lead_id}/${req.body.user_id}`,
        callerId: process.env.TWILIO_NUMBER,
    }, req.body.number);

    return res.type('text/xml').send(voiceResponse.toString());
}

async function recordCallback(req, res) {
    try {
        await models.Records.create({
            user_id: req.params.user_id,
            lead_id: req.params.lead_id,
            url: req.body.RecordingUrl
        })
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    token,
    voice,
    recordCallback
}