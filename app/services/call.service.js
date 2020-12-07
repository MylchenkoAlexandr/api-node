const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const models = require('../../database/models');
const UserService = require('./user.service');
const TwilioService = require('../services/twilio.service');
const clientSocket = require('socket.io-client')(process.env.WEBSOCKET_URL);
const UserRepository = require('../repository/user.repository');

class CallService {
    createOutboundCall(callParams, lead_id) {
        try {
            console.log("calling");
            client.calls.create(callParams)
                .then(async call => {
                    await models.conferences.create({
                        lead_id: lead_id,
                        conferenceId: call.sid
                    });
                })
                .catch(err => console.error(err));
        } catch (error) {
            throw error;
        }
    }

    async transferCallToGuide(call, guide_id = null) {
        try {
            const callSid = call.CallSid;

            let guideId = guide_id;

            if (!guideId) {
                guideId = await UserService.findSuitableWorker("guide");
            }

            if (guideId && callSid) {
                const callbackUrl = TwilioService.generateConnectConferenceUrl(guideId, callSid);

                TwilioService.updateCallUrl(callSid, callbackUrl);
                TwilioService.addWorkersToConference(guideId, callbackUrl);

                await models.conferences.update({
                    guide_id: guideId
                }, {
                    where: {
                        conferenceId: callSid
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    }

    async transferCallToAgent(guide_id) {
        try {
            const existCall = await models.conferences.findOne({
                where: {
                    guide_id: guide_id
                },
                order: [['createdAt', 'DESC']],
            });

            const callSid = existCall.conferenceId;

            const lead = await models.Leads.findOne({
                attributes: ['user_id', 'state_id'],
                where: {
                    id: existCall.lead_id
                }
            })

            let agent_id;

            if (lead.user_id != null) {
                agent_id = await await UserRepository.findSuitableWorker("agent", null, lead.user_id);
            }

            if (!agent_id) {
                agent_id = await UserRepository.findSuitableWorker("agent", lead.state_id);
            }

            if (agent_id) {
                const callbackUrl = TwilioService.generateConnectConferenceUrl(agent_id, callSid);
                TwilioService.updateCallUrl(callSid, callbackUrl);
                TwilioService.addWorkersToConference(agent_id, callbackUrl);

                clientSocket.emit("assign-agent", existCall.lead_id, agent_id);

                if (existCall.user_id != agent_id) {
                    await existCall.update({
                        agent_id: agent_id
                    });
                }

                return {
                    status: "success",
                    message: "Call transferring to the Agent!"
                };
            }

            return {
                status: "error",
                message: "No suitable agent for the call!"
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CallService;