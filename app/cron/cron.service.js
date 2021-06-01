const models = require("../../database/models");
const MessageService = require("../twilio/message/message.service");
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const TransformationHelper = require('../helpers/transformation.helper');

class CronService {
    async sendNotification(followup, nfText) {
        try {
            const defaultPhone = process.env.TWILIO_NUMBER;
            const user = await models.Users.findOne({
                where: {
                    id: followup.user_id
                }
            });

            if (user) {
                if (user.phone) {
                    const agentPhone = TransformationHelper.formatPhoneForCall(user.phone);
                    // Sending sms to customer numbers
                    MessageService.sendMessage(defaultPhone, agentPhone, nfText);
                    // Sending notification 
                    client.emit("send_follow_up_notification", followup.user_id, nfText);
                }
            }
        } catch (error) {
            throw error;
        }
    }

    async followUpsNotification() {
        try {
            const followups = await models.Followups.findAll({
                where: {
                    completed: 0
                }
            });

            followups.forEach(async (record) => {
                let current = new Date();
                current.setSeconds(0);
                current.setMilliseconds(0);
                const cTime = `${current.getHours()}:${current.getMinutes().length == 1 ? "0" + current.getMinutes() : current.getMinutes()}:0${current.getSeconds()}`;
                current = +current;

                let followup = new Date(record.datetime);
                followup.setSeconds(0);
                followup.setMilliseconds(0);
                const fTime = `${followup.getHours()}:${followup.getMinutes().length == 1 ? "0" + followup.getMinutes() : followup.getMinutes()}:0${followup.getSeconds()}`;
                followup = +followup;

                const b10Min = followup - 10 * 60000;
                const b1Hour = followup - 60 * 60000;

                const lead = await models.Leads.findOne({
                    where: {
                        id: record.lead_id
                    }
                });

                const user = await models.Users.findOne({
                    where: {
                        id: record.user_id
                    }
                });

                if (lead) {
                    let leadInfo = lead.fullname ? lead.fullname.toUpperCase() : lead.phone;
                    let nfText = "Your appointment with " + leadInfo + " starts now!";

                    if (current == followup) {
                        this.sendNotification(record, nfText);
                    } else if (current == b1Hour) {
                        nfText = "Hi " + user.fname + ", your appointment with " + leadInfo + " starts in 1 hour!";
                        this.sendNotification(record, nfText);
                    } else if (current == b10Min) {
                        nfText = "Hi " + user.fname + ", your appointment with " + leadInfo + " starts in 10 mins!";
                        this.sendNotification(record, nfText);
                    } else if (cTime == fTime) {
                        nfText = "Your follow-up with " + leadInfo + " was expired. Please follow up asap!";
                        this.sendNotification(record, nfText);
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CronService;