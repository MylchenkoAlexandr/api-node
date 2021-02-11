const models = require('../../database/models');
const MessageService = require('../twilio/message/message.service');
const MailService = require('../services/mail.service');
const TransformationHelper = require('../helpers/transformation.helper');
const nodemailer = require('nodemailer');

class TemplatesController {
    async getSmsTemplates(req, res) {
        try {
            if ("user_id" in req.params) {
                const templates = await models.sms_tmp.findAll({
                    where: {
                        user_id: req.params.user_id
                    }
                });

                return res.status(200).json(templates);
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async getEmailTemplates(req, res) {
        try {
            if ("user_id" in req.params) {
                const templates = await models.email_tmp.findAll({
                    where: {
                        user_id: req.params.user_id
                    }
                });

                return res.status(200).json(templates);
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async createSmsTemplate(req, res) {
        try {
            if ("user_id" in req.body) {
                const template = await models.sms_tmp.create({
                    user_id: req.body.user_id,
                    title: req.body.title,
                    text: req.body.text,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                return res.status(200).json({ message: 'Template created', template: template });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async createEmailTemplate(req, res) {
        try {
            if ("user_id" in req.body) {
                const template = await models.email_tmp.create({
                    user_id: req.body.user_id,
                    title: req.body.title,
                    text: req.body.text,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                return res.status(200).json({ message: 'Template created', template: template });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async updateEmailTemplate(req, res) {
        try {
            if ("id" in req.body) {
                const result = await models.email_tmp.update({
                    title: req.body.title,
                    text: req.body.text,
                    updatedAt: new Date(),
                }, { 
                    where: { id: req.body.id } 
                });

                return res.status(200).json({ message: 'Template updated', count: result });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async updateSmsTemplate(req, res) {
        try {
            if ("id" in req.body) {
                const result = await models.sms_tmp.update({
                    title: req.body.title,
                    text: req.body.text,
                    updatedAt: new Date(),
                }, { 
                    where: { id: req.body.id } 
                });

                return res.status(200).json({ message: 'Template updated', count: result });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async removeEmailTemplate(req, res) {
        try {
            if ("id" in req.body) {
                const result = await models.email_tmp.destroy({
                    where: {
                        id: req.body.id,
                    }
                });
                
                return res.status(200).json({ message: 'Template removed', result: result });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async removeSmsTemplate(req, res) {
        try {
            if ("id" in req.body) {
                const result = await models.sms_tmp.destroy({
                    where: {
                        id: req.body.id,
                    }
                });
                
                return res.status(200).json({ message: 'Template removed', result: result });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async sendSms(req, res) {
        try {
            if ("id" in req.body && "lead" in req.body && "user" in req.body) {
                const template = await models.sms_tmp.findByPk(req.body.id);

                const from = process.env.TWILIO_NUMBER;
                const to = TransformationHelper.formatPhoneForCall(req.body.lead.phone);
                const text = template.text;

                if (template !== null) {
                    await MessageService.sendMessage(from, to, text);
                }

                const sms = await models.Sms.create({
                    lead_id: req.body.lead.id,
                    user_id: req.body.user.id,
                    send_status: 1,
                    read_status: 1,
                    is_client_message: 0,
                    text: template.text,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                return res.status(200).json({ message: 'Message sended', sms: sms });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }

    async sendEmail(req, res) {
        try {
            if ("id" in req.body && "lead" in req.body && "user" in req.body) {
                const template = await models.email_tmp.findByPk(req.body.id);
                const user = await models.Users.findByPk(req.body.user.id);

                const mailOptions = {
                    from: `${user.fname} ${user.lname} <${user.email}>`,
                    to: req.body.lead.email,
                    subject: `To: ${req.body.lead.fullname}, From: ❤️ @ Blueberry`,
                    text: template.text,
                };

                const emailParams = {
                    lead_id: req.body.lead.id,
                    user_id: req.body.user.id,
                    text: template.text
                }

                const result = await MailService.sendFromAgent(mailOptions, emailParams, user);

                return res.status(200).json({ message: 'Message sent' });
            }
            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new TemplatesController();