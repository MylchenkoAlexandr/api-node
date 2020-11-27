const AutoDiallerFacade = require('../facades/autodialler.facade');
const UserRepository = require('../repository/user.repository');
const LeadService = require('../services/lead.service');
const CallService = require('../services/call.service');
const PhoneService = require('../services/phone.service');
const TransformationHelper = require('../helpers/transformation.helper');
const models = require('../../database/models');

class AutoDiallerController {
    async getLeadIdFromCall(req, res) {
        try {
            if (('field' in req.body) && ('id' in req.body)) {
                const response = await AutoDiallerFacade.getLeadIdFromCall(req.body.field, req.body.id);
                return res.status(response.code).json({ status: response.status, message: response.message, lead_id: response.data });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw err;
        }
    }

    /**
     * Call customers one by one
     * @param {object} req
     * @param {object} res
     */
    async callOneByOne(req, res) {
        try {
            const guide_id = await UserRepository.findSuitableWorker("guide", null, req.body.guide_id);

            if (!guide_id) {
                return res.status(202).json({ status: 'error', message: "Need GO ONLINE to start AutoDialler proccess" });
            }

            const lead = await LeadService.getSuitableLeadsForCall(1);

            let agent_id;

            if (lead.user_id != null) {
                agent_id = await await UserRepository.findSuitableWorker("agent", null, lead.user_id);
            }

            if (!agent_id) {
                agent_id = await UserRepository.findSuitableWorker("agent", lead.state_id);
            }

            if (!agent_id) {
                return res.status(202).json({ status: 'error', message: "All agent are offline" });
            }

            if (lead) {
                const fromPhone = await PhoneService.pickPhoneNumberByArea(lead);
                CallService.createOutboundCall({
                    statusCallback: process.env.CALLBACK_TWILIO + '/api/autodialler/callback/one-by-one',
                    statusCallbackEvent: ['answered', 'completed'],
                    statusCallbackMethod: 'POST',
                    url: 'http://demo.twilio.com/docs/classic.mp3',
                    from: TransformationHelper.formatPhoneForCall(fromPhone),
                    // to: TransformationHelper.formatPhoneForCall(lead.phone)
                    to: '+380632796212'
                }, lead.id);

                return res.status(200).json({ status: "success", message: "AutoDialer flow has started!" });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }

    async callBackOneByOne(req, res) {
        try {
            if (req.body) {
                if (req.body.CallStatus == 'in-progress') {
                    await CallService.transferCallToGuide(req.body);
                    // websocket for switching color to green
                    // set AD_STATUS in lead answered
                } else {
                    // websocket for switching color to red
                    // set AD_STATUS in lead 
                    console.log(req.body.CallStatus);

                    // switch(req.body.CallStatus){
                    //     case "completed":

                    //         break;

                    //     case "busy":

                    //         break;
                    // }
                }
            }
            return res.status(200);
        } catch (error) {
            throw error;
        }
    };

    async transferCallToAgent(req, res) {
        try {
            if ("guide_id" in req.body) {
                const responce = await CallService.transferCallToAgent(req.body.guide_id);

                return res.status(200).json({ status: responce.status, message: responce.message });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new AutoDiallerController;