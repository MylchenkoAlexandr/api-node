const MessageService = require("./message.service");
const TransformationHelper = require('../../helpers/transformation.helper');
const SmsRepository = require('../../repository/sms.repository');
const SettingsService = require('../../services/settings.service');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const models = require('../../../database/models');
class MessageController {
    async allByLeadId(req, res) {
        try {
            if ("lead_id" in req.params) {
                const messages = await SmsRepository.getAllByLeadId(req.params.lead_id);

                if (messages) {
                    return res.status(200).json(messages);
                }
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }

    async saveAndSendMessage(req, res) {
        try {
            if ("lead_id" in req.body && "to" in req.body && "user_id" in req.body && "text" in req.body) {
                let response = {
                    status: "success",
                    message: "Message sent success!"
                };
                const data = req.body;
                const settings = await SettingsService.get();

                const defaultPhone = settings.default_phone;

                data.from = TransformationHelper.formatPhoneForCall(defaultPhone);
                data.to = TransformationHelper.formatPhoneForCall(data.to);

                const sendStatus = await MessageService.sendMessage(data.from, data.to, data.text);

                let message = await MessageService.create(data.lead_id, data.user_id, sendStatus, 0, data.text);

                if (message.id) {
                    client.emit("add-message", message.id);
                }

                if (!sendStatus) {
                    response = {
                        status: "error",
                        message: "Message doesn`t sent, please retry!"
                    };
                }

                return res.status(200).json({ status: response.status, message: response.message });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }

    async resendMessage(req, res) {
        try {
            if ("id" in req.body) {
                let response = {
                    status: "success",
                    message: "Message sent success!"
                };

                const data = req.body;

                const settings = await SettingsService.get();

                let sms = await SmsRepository.getOneById(data.id);

                let from = TransformationHelper.formatPhoneForCall(settings.default_phone);

                let to = TransformationHelper.formatPhoneForCall(sms.to);

                const sendStatus = await MessageService.sendMessage(from, to, sms.text);

                await MessageService.setSendStatus(data.id, sendStatus);

                client.emit("update-send-status", data.id);

                if (!sendStatus) {
                    response = {
                        status: "error",
                        message: "Message doesn`t sent, please retry!"
                    };
                }

                return res.status(200).json({ status: response.status, message: response.message });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }


    async receiveMessage(req, res) {
        try {
            if (req.body) {
                let data = req.body;
                console.log("🚀 ~ file: message.controller.js ~ line 108 ~ MessageController ~ receiveMessage ~  data", data)

                const formatedPhone = TransformationHelper.phoneNumberForSearch(data.From);

                let lead = await models.Leads.findOne({
                    where: {
                        phone: formatedPhone
                    }
                });

                if (lead) {
                    let message = await MessageService.create(lead.id, null, 1, 1, data.Body);

                    if (message.id) {
                        client.emit("add-message", message.id);
                    }
                } else {
                    await MessageService.create(null, null, 1, 1, data.Body);
                }

                return res.status(200).json();
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new MessageController();