const NotificationsService = require('../services/notifications.service');
const SmsRepository = require('../repository/sms.repository');
const CustomerVMRepository = require('../repository/customersVM.repository');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);

class NotificationsController {
    async getNotifications(req, res) {
        try {
            if ("user_id" in req.params) {
                const notifications = await NotificationsService.getNotifications(req.params.user_id);
                return res.status(200).json({ status: "success", message: "Notifications loaded", notifications });
            }
            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getMessageNotifications(req, res) {
        try {
            if ("user_id" in req.params && "lead_id" in req.params) {
                const notifications = await NotificationsService.getMessageNotifications(req.params.user_id, req.params.lead_id);
                return res.status(200).json({ status: "success", message: "Notifications loaded", notifications });
            }
            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getVoicemailsNotifications(req, res) {
        try {
            if ("user_id" in req.params && "lead_id" in req.params) {
                const notifications = await NotificationsService.getVoicemailsNotifications(req.params.user_id, req.params.lead_id);
                return res.status(200).json({ status: "success", message: "Notifications loaded", notifications });
            }
            return res.status(400).json({ status: "error", message: "Bad request" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async updateMessageNotification(req, res) {
        try {
            if ("message_id" in req.body) {
                const result = SmsRepository.updateReadStatus(req.body.message_id);
                
                
                if (result) {
                    client.emit('update-notification', req.body.message_id, 'message');
                    return res.status(200).json({status: "success", message: "Messages updated"});
                }
            }
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async updateVoicemailNotification(req, res) {
        try {
            if ("voicemail_id" in req.body) {
                const result = CustomerVMRepository.updateListenStatus(req.body.voicemail_id);

                if (result) {
                    client.emit('update-notification', req.body.voicemail_id, 'voicemail');
                    return res.status(200).json({status: "success", message: "Voicemail updated"});
                }
            }
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new NotificationsController;