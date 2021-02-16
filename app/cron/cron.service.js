const models = require("../../database/models");
const MessageService = require("../twilio/message/message.service");
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const TransformationHelper = require('../helpers/transformation.helper');
const moment = require('moment');

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
                // const agentPhone = TransformationHelper.formatPhoneForCall(user.phone);
                const agentPhone = "+380632796212";
                // Sending sms to customer numbers
                MessageService.sendMessage(defaultPhone, agentPhone, nfText);
                // Sending notification 
                client.emit("send_follow_up_notification", followup.user_id, nfText);
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
                current = +current;

                let followup = new Date(record.datetime);
                followup.setSeconds(0);
                followup.setMilliseconds(0);
                followup = +followup;

                const b10Min = followup - 10 * 60000;
                const b1Hour = followup - 60 * 60000;

                const lead = await models.Leads.findOne({
                    where: {
                        id: record.lead_id
                    }
                });

                if (lead) {
                    let nfText = "The follow-up date/time which you have setted to this lead " + lead.fullname.toUpperCase() + " came!";

                    if (current == followup) {
                        this.sendNotification(record, nfText);
                    } else if (current == b1Hour) {
                        nfText = "Left one hour before follow-up date/time for this lead " + lead.fullname.toUpperCase() + " came!";
                        this.sendNotification(record, nfText);
                    } else if (current == b10Min) {
                        nfText = "Left 10 minutes before follow-up date/time for this lead " + lead.fullname.toUpperCase() + " came!";
                        this.sendNotification(record, nfText);
                    }
                }
            });
        } catch (error) {
            throw error;
        }
    }

    async expiredFollowUpNotification() {
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
                current = +current;

                let followup = record.datetime;
                followup.setSeconds(0);
                followup.setMilliseconds(0);
                followup = +followup;

                const lead = await models.Leads.findOne({
                    where: {
                        id: record.lead_id
                    }
                });

                if (lead) {
                    const nfText = "The followup for the " + lead.fullname.toUpperCase() + " was expired, please check it as soon as posible!";
                    if (current > followup) {
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