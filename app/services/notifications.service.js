const SmsRepository = require('../repository/sms.repository');
const CustomersVMRepository = require('../repository/customersVM.repository');
const TransformationHelper = require('../helpers/transformation.helper');

class NotificationsService {
    async getNotifications(user_id) {
        try {
            let notifications = [];

            const messages = await SmsRepository.getUnreadMessages(user_id);
            const voicemails = await CustomersVMRepository.getNotListenedCustomerVM(user_id);

            messages.forEach(message => {
                notifications.push({
                    id: message.id,
                    lead_id: message.lead_id,
                    user_id: message.user_id,
                    lead_name: message.lead_name,
                    type: 'message',
                    body: message.text,
                    create_date: message.createdAt,
                    time_passed: TransformationHelper.timePassed(message.createdAt),
                });
            });

            voicemails.forEach(voicemail => {
                notifications.push({
                    id: voicemail.id,
                    lead_id: voicemail.lead_id,
                    user_id: voicemail.user_id,
                    lead_name: voicemail.lead_name,
                    type: 'voicemail',
                    body: voicemail.url,
                    create_date: voicemail.createdAt,
                    time_passed: TransformationHelper.timePassed(voicemail.createdAt),
                });
            });

            notifications.sort((a, b) => b.create_date.getTime() - a.create_date.getTime());

            return notifications;
        } catch (error) {
            throw error;
        }
    }

    async getVoicemailsNotifications(user_id, lead_id) {
        let notifications = [];

        const voicemails = await CustomersVMRepository.getNotListenedCustomerVMByLead(user_id, lead_id);

        voicemails.forEach(voicemail => {
            notifications.push({
                id: voicemail.id,
                lead_id: voicemail.lead_id,
                user_id: voicemail.user_id,
                lead_name: voicemail.lead_name,
                type: 'message',
                body: voicemail.url,
                create_date: voicemail.createdAt,
                time_passed: TransformationHelper.timePassed(voicemail.createdAt),
            });
        });

        return notifications;
    }

    async getMessageNotifications(user_id, lead_id) {
        let notifications = [];

        const messages = await SmsRepository.getUnreadMessagesByLeadId(user_id, lead_id);

        messages.forEach(message => {
            notifications.push({
                id: message.id,
                lead_id: message.lead_id,
                user_id: message.user_id,
                lead_name: message.lead_name,
                type: 'message',
                body: message.text,
                create_date: message.createdAt,
                time_passed: TransformationHelper.timePassed(message.createdAt),
            });
        });

        return notifications;
    }
}

module.exports = new NotificationsService;