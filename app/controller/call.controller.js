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

class CallController {
    token(req, res) {
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

    voice(req, res) {
        let voiceResponse;
        if (req.body.callType == 'single') {
            voiceResponse = new VoiceResponse();

            voiceResponse.dial({
                record: 'record-from-answer-dual',
                recordingStatusCallbackEvent: "completed",
                recordingStatusCallback: `${process.env.CALLBACK_TWILIO}/api/call/record-callback/${req.body.lead_id}/${req.body.user_id}`,
                callerId: process.env.TWILIO_NUMBER,
            }, req.body.number);
        } else if (req.body.callType == 'conf') {
            const twiml = new VoiceResponse();

            voiceResponse = twiml.dial();

            voiceResponse.conference(req.body.lead_id, {
                endConferenceOnExit: true,
                record: 'true',
                recordingStatusCallbackEvent: "completed",
                recordingStatusCallback: `${process.env.CALLBACK_TWILIO}/api/call/record-callback/${req.body.lead_id}/${req.body.user_id}`,
            });

            // Connect participiant to the conference 
            twilioClient.conferences(req.body.lead_id)
                .participants
                .create({
                    from: process.env.TWILIO_NUMBER,
                    to: req.body.number,
                    statusCallback: `${process.env.CALLBACK_TWILIO}/api/call/customer-status-callback/${req.body.user_id}`,
                    statusCallbackEvent: ["completed"],
                    startConferenceOnEnter: true,
                    endConferenceOnExit: true,
                }).then(res => {
                    client.emit("send-conf-params", { callSid: res.callSid, conferenceSid: res.conferenceSid });
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
                                agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(lead.state_id);
                            } else {
                                let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                                if (state_id) {
                                    agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(state_id);
                                }
                            }
                        }
                    } else {
                        if (lead.state_id) {
                            agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(lead.state_id);
                        } else {
                            let state_id = await StateService.getStateIdFromPhone(formatedPhone);

                            if (state_id) {
                                agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(state_id);
                            }
                        }
                    }
                } else {
                    state_id = await StateService.getStateIdFromPhone(formatedPhone);

                    if (state_id) {
                        agent = await UserRepository.findSuitableAgentByCountOfBlueberryLeads(state_id);
                    }

                    lead = await models.Leads.create({
                        state_id: state_id ? state_id : null,
                        source_id: 1,
                        status_id: 1,
                        type_id: 2,
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

                    // dial.client(agent.id);
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
                    twilioClient.conferences(confName)
                        .participants
                        .create({
                            from: process.env.TWILIO_NUMBER,
                            to: `client:${agent.id}`,
                            endConferenceOnExit: true,
                        }).then(res => {
                            client.emit("send-conf-params", { callSid: lead.phone, conferenceSid: res.conferenceSid });
                        }).catch((err) => {
                            console.log(err);
                        });
                } else {
                    // if (!lead.user_id) {
                    //     if (state_id) {
                    //         agent = await UserRepository.findSuitableAgentByState(state_id);

                    //         client.emit("assign-agent", lead.id, agent.id);
                    //         recordCall = true;
                    //     }
                    // }

                    twiml.play(process.env.WEBSOCKET_URL + '/' + callbackVoiseMailUrl);

                    // if (recordCall) {
                    twiml.record({
                        action: `${process.env.CALLBACK_TWILIO}/api/call/recieve-voicemail/${lead.id}`,
                        maxLength: 300,
                        playBeep: true,
                        method: 'POST',
                        finishOnKey: '*'
                    });
                    // }

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

    async playPreRecordedVM(req, res) {
        try {
            // twilioClient.calls.create({
            //     url: 'https://api.twilio.com/cowbell.mp3'
            // });

            twilioClient.calls(req.body.callSid)
                .update({
                    // from: "+380632796212",
                    // to: "+18339282583",
                    // url: 'http://demo.twilio.com/docs/classic.mp3'
                    method: "POST",
                    url: `${process.env.CALLBACK_TWILIO}/api/call/voicemail-response`,
                });

            // const response = new VoiceResponse();
            // response.enqueue({
            //     waitUrl: 'https://api.twilio.com/cowbell.mp3'
            // }, 'support');

            // const response = new VoiceResponse();
            // response.play('https://api.twilio.com/cowbell.mp3');


            // response.play({
            //     loop: 10
            // }, '');


            // res.type('text/xml');

            return res.status(200).send({});
        } catch (error) {
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
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CallController;