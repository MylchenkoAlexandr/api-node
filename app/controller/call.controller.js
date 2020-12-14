const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const axios = require('axios');
const RecordService = require('../services/records.service');
const models = require('../../database/models');
const TransformationHelper = require('../helpers/transformation.helper');
const StateService = require('../services/state.service');
const UserRepository = require('../repository/user.repository');

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
        const transcriptionUrl = transcriptionRequestBody.results[process.env.TWILIO_ADDONS_VOICEBASE_NAME].payload[0].url;
        const recordingUrl = transcriptionRequestBody.results[process.env.TWILIO_ADDONS_VOICEBASE_NAME].links.recording;
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

async function inboundCall(req, res) {
    try {
        let formatedPhone = TransformationHelper.phoneNumber(req.body.From).replace('+1 ', '').replace(' ', '');

        if ("CallSid" in req.body && "From" in req.body) {
            const twiml = new VoiceResponse();
            twiml.say({ voice: 'alice' }, 'Hello, welcome to Blueberry! Please wait connection with agent!');

            let toPhone;

            let lead = await models.Leads.findOne({
                where: {
                    phone: formatedPhone
                }
            });

            if (lead) {
                if (lead.user_id) {
                    toPhone = await UserRepository.findSuitableAgentWithPhoneNumber(lead.user_id);
                }

                if (!toPhone && lead.state_id) {
                    toPhone = await UserRepository.findSuitableAgentWithPhoneNumber(null, lead.state_id);
                }
            } else {
                let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                if (state_id) {
                    toPhone = await UserRepository.findSuitableAgentWithPhoneNumber(null, state_id);
                }
            }

            if (!toPhone) {
                toPhone = "+13108769581";
            } else {
                models.Users.update({
                    INBOUND_status: 0
                }, {
                    where: {
                        phone: toPhone
                    }
                });

                toPhone = TransformationHelper.formatPhoneForCall(toPhone);
            }

            twiml.dial(toPhone);

            res.type('text/xml');
            return res.status(200).send(twiml.toString());
        }
        return res.status(400).json({ status: 'error', message: "Bad request!" });
    } catch (error) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw error
    }
}


module.exports = {
    token,
    voice,
    recordCallback,
    transcriptionCallback,
    inboundCall
}