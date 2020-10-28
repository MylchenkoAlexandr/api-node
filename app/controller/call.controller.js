const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const axios = require('axios');
const RecordService = require('../services/records.service');

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
        const record = {
            user_id: req.params.user_id,
            lead_id: req.params.lead_id,
            url: req.body.RecordingUrl,
        };

        client.emit('record-create', record);

        return res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw err;
    }
}

async function transcriptionCallback(req, res) {
    try {
        let transcriptionRequestBody = JSON.parse(req.body.AddOns);
        const transcriptionUrl = transcriptionRequestBody.results[process.env.ADDONS_VOICEBASE_NAME].payload[0].url;
        const recordingUrl = transcriptionRequestBody.results[process.env.ADDONS_VOICEBASE_NAME].links.recording;
        const result = await axios.get(transcriptionUrl, {
            auth: {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            }
        });
        const transcriptionText = result.data.media.transcripts.text;

        await RecordService.saveTranscriptionText(recordingUrl, transcriptionText);

        return res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw err;
    }
}

module.exports = {
    token,
    voice,
    recordCallback,
    transcriptionCallback
}