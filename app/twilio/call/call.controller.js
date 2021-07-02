const twilio = require('twilio');
const ClientCapability = twilio.jwt.ClientCapability;
const VoiceResponse = twilio.twiml.VoiceResponse;
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const axios = require('axios');
const RecordService = require('../../services/records.service');
const models = require('../../../database/models');
const TransformationHelper = require('../../helpers/transformation.helper');
const StateService = require('../../services/state.service');
const UserRepository = require('../../repository/user.repository');
const MessageService = require('../message/message.service');
const SettingsService = require('../../services/settings.service');
const TwilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const TwilioService = require('../../services/twilio.service');

class CallController {
    token(req, res) {
        const token = TwilioService.genereteCapabilityToken(req.params.agent_id);
        return res.status(200).json({ token: token });
    }

    async voice(req, res) {
        let voiceResponse;
        const leadId = req.body.lead_id;
        let from = process.env.TWILIO_NUMBER;

        const lead = await models.Leads.findOne({
            where: {
                id: leadId
            },
            attributes: ['type_id']
        });

        if (lead.type_id == 4) {
            from = process.env.TWILIO_HEALTH_NUMBER;
        }

        if (req.body.callType == 'single') {
            voiceResponse = new VoiceResponse();

            voiceResponse.dial({
                record: 'record-from-answer-dual',
                recordingStatusCallbackEvent: "completed",
                recordingStatusCallback: `${process.env.CALLBACK_TWILIO}/api/call/record-callback/${leadId}/${req.body.user_id}`,
                callerId: from,
            }, req.body.number);
        } else if (req.body.callType == 'conf') {
            const twiml = new VoiceResponse();

            voiceResponse = twiml.dial();
            const confName = leadId + (+new Date());
            voiceResponse.conference(confName, {
                endConferenceOnExit: true,
                record: 'true',
                recordingStatusCallbackEvent: "completed",
                recordingStatusCallback: `${process.env.CALLBACK_TWILIO}/api/call/record-callback/${leadId}/${req.body.user_id}`,
            });

            // Connect participiant to the conference 
            TwilioClient.conferences(confName)
                .participants
                .create({
                    from: from,
                    to: req.body.number,
                    statusCallback: `${process.env.CALLBACK_TWILIO}/api/call/customer-status-callback/${req.body.user_id}`,
                    statusCallbackEvent: ["completed"],
                    startConferenceOnEnter: true,
                    endConferenceOnExit: true,
                }).then(res => {
                    client.emit("send-conf-params", { callSid: res.callSid, conferenceSid: res.conferenceSid }, req.body.user_id);
                }).catch((err) => {
                    console.log(err);
                });
        }

        return res.type('text/xml').send(voiceResponse.toString());
    }

    async recordCallback(req, res) {
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

    async transcriptionCallback(req, res) {
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

    async inboundCall(req, res) {
        try {
            const data = req.body;
            if ("CallSid" in data && "From" in data) {
                let agent, state_id;
                let leadType = { type_id: 2, subrole_id: 1 };
                const settings = await SettingsService.get();
                const defaultPhone = TransformationHelper.formatPhoneForCall(settings.default_phone);

                if (data.To === process.env.TWILIO_HEALTH_NUMBER) {
                    leadType = { type_id: 4, subrole_id: 2 }
                }

                let callbackVoiseMailUrl = settings.default_voice_mail;
                let callbackTextMessage = settings.default_text_message;

                const formatedPhone = TransformationHelper.phoneNumberForSearch(data.From);

                let lead = await models.Leads.findOne({
                    where: {
                        phone: formatedPhone,
                        type_id: leadType.type_id
                    }
                });

                if (!lead) {
                    lead = await models.Leads.findOne({
                        where: {
                            second_phone: formatedPhone,
                            type_id: leadType.type_id
                        }
                    });
                }

                const twiml = new VoiceResponse();

                twiml.say({
                    voice: 'alice'
                }, 'Please wait connection with agent!');

                if (lead) {
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
                        }
                    } else {
                        if (lead.state_id) {
                            agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(lead.state_id, leadType);
                        } else {
                            let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                            if (state_id) {
                                agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(state_id, leadType);
                            }
                        }
                    }
                } else {
                    state_id = await StateService.getStateIdFromPhone(formatedPhone);

                    if (state_id) {
                        agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(state_id, leadType);
                    }

                    lead = await models.Leads.create({
                        state_id: state_id ? state_id : null,
                        source_id: 1,
                        status_id: 1,
                        type_id: leadType.type_id,
                        phone: TransformationHelper.phoneNumberForSearch(data.From)
                    });

                    if (lead) {
                        client.emit("send_lead", lead.id);
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

                    const confName = lead.id + (+new Date());

                    dial.conference(confName, {
                        startConferenceOnEnter: true,
                        endConferenceOnExit: true,
                        record: 'true',
                        participantLabel: lead.phone,
                        recordingStatusCallbackEvent: "completed",
                        recordingStatusCallback: `${process.env.CALLBACK_TWILIO}/api/call/record-callback/${lead.id}/${agent.id}`,
                    });

                    // Connect participiant to the conference 
                    TwilioClient.conferences(confName)
                        .participants
                        .create({
                            from: process.env.TWILIO_NUMBER,
                            to: `client:${agent.id}`,
                            endConferenceOnExit: true,
                        }).then(res => {
                            client.emit("send-conf-params", { callSid: lead.phone, conferenceSid: res.conferenceSid }, agent.id);
                        }).catch((err) => {
                            console.log(err);
                        });
                } else {
                    twiml.play(process.env.WEBSOCKET_URL + '/' + callbackVoiseMailUrl);

                    twiml.record({
                        action: `${process.env.CALLBACK_TWILIO}/api/call/recieve-voicemail/${lead.id}`,
                        maxLength: 300,
                        playBeep: true,
                        method: 'POST',
                        finishOnKey: '*'
                    });

                    MessageService.sendMessage(defaultPhone, data.From, callbackTextMessage);
                }

                return res.status(200).send(twiml.toString());
            }

            return res.status(400).json({ status: 'error', message: "Bad request!" });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error!" });
            throw error;
        }
    }

    // Add new function for the health inbout call

    async recieveVoiceMail(req, res) {
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

    async voiceMailResponce(req, res) {
        try {
            const response = new VoiceResponse();
            response.play('https://api.twilio.com/cowbell.mp3');
            return res.status(200).send(response.toString());
        } catch (error) {
            throw error;
        }
    }

    async customerStatusCallback(req, res) {
        try {
            const data = req.body;
            if (data.CallStatus === "cancelled" || data.CallStatus === 'busy' || data.CallStatus === "failed" || data.CallStatus === "no-answer") {
                client.emit("remove_lock_from_agent", req.params.user_id, null);
            }
            return res.status(200).send({});
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CallController;