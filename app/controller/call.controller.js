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
const MessageService = require('../twilio/message/message.service');
const SettingsService = require('../services/settings.service');
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

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
        const data = req.body;

        if ("CallSid" in data && "From" in data) {
            let agent;
            let recordCall = false;

            const settings = await SettingsService.get();
            const defaultPhone = TransformationHelper.formatPhoneForCall(settings.default_phone);

            let callbackVoiseMailUrl = settings.default_voice_mail;
            let callbackTextMessage = settings.default_text_message;

            const formatedPhone = TransformationHelper.phoneNumberForSearch(data.From);

            let lead = await models.Leads.findOne({
                where: {
                    phone: formatedPhone
                }
            });

            const twiml = new VoiceResponse();

            twiml.say({
                voice: 'alice'
            }, 'Please wait connection with agent!');

            if (lead) {
                recordCall = true;
                if (lead.user_id) {
                    const user = await models.Users.findOne({
                        where: { id: lead.user_id }
                    });

                    if (user) {
                        agent = await UserRepository.findSuitableAgent(lead.user_id);

                        if (!agent) {
                            callbackVoiseMailUrl = user.voice_mail;
                            callbackTextMessage = user.text_message;
                        }
                    } else {
                        if (lead.state_id) {
                            agent = await UserRepository.findSuitableAgent(null, lead.state_id);
                        } else {
                            let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                            if (state_id) {
                                agent = await UserRepository.findSuitableAgent(null, state_id);
                            }
                        }
                    }
                } else {
                    if (lead.state_id) {
                        agent = await UserRepository.findSuitableAgent(null, lead.state_id);
                    } else {
                        let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                        if (state_id) {
                            agent = await UserRepository.findSuitableAgent(null, state_id);
                        }
                    }
                }
            } else {
                let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                if (state_id) {
                    agent = await UserRepository.findSuitableAgent(null, state_id);
                }
            }

            if (agent) {
                if (lead) {
                    if (lead.user_id != agent.id) {
                        client.emit("assign-agent", lead.id, agent.id);
                    }

                    if (lead.id) {
                        client.emit("send-lead-id", lead.id, agent.id);
                    }
                }

                const dial = twiml.dial();

                dial.client(agent.id);
            } else {
                twiml.play(process.env.WEBSOCKET_URL + '/' + callbackVoiseMailUrl);

                if (recordCall) {
                    twiml.record({
                        action: `${process.env.CALLBACK_TWILIO}/api/call/recieve-voicemail/${lead.id}`,
                        maxLength: 300,
                        playBeep: true,
                        method: 'POST',
                        finishOnKey: '*'
                    });
                }

                MessageService.sendMessage(defaultPhone, data.From, callbackTextMessage);
            }
            res.type('text/xml');
            return res.status(200).send(twiml.toString());
        }

        return res.status(400).json({ status: 'error', message: "Bad request!" });
    } catch (error) {
        res.status(500).json({ status: 'error', message: "Server Error!" });
        throw error;
    }
}


async function recieveVoiceMail(req, res) {
    try {
        const data = req.body;
        if ("RecordingUrl" in data && 'lead_id' in req.params) {
            client.emit("create_customer_voice_mail", req.params.lead_id, data.RecordingUrl);
            return res.sendStatus(200);
        }
        return res.status(400).send({ status: "error", message: "Bad request!" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Server error!" });
        throw error;
    }
}

async function playPreRecordedVM(req, res) {
    try {
        twilioClient.calls.create({
            from: "+380632796212",
            to: "+18339282583",
            url: 'http://demo.twilio.com/docs/classic.mp3'
        });

        // twilioClient.calls(req.body.callSid)
        //     .update({
        //         from: "+380632796212",
        //         to: "+18339282583",
        //         url: 'http://demo.twilio.com/docs/classic.mp3'
        //     });

        // res.type('text/xml');url: 'http://demo.twilio.com/docs/classic.mp3',

        return res.status(200).send({});
    } catch (error) {
        throw error;
    }
}

module.exports = {
    token,
    voice,
    recordCallback,
    transcriptionCallback,
    inboundCall,
    recieveVoiceMail,
    playPreRecordedVM
}