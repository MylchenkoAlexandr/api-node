const SmsRepository = require('../repository/sms.repository');
const CustomersVMRepository = require('../repository/customersVM.repository');

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
                    lead_name: message.lead_name,
                    type: 'message',
                    body: message.text,
                    create_date: message.createdAt,
                });
            });

            voicemails.forEach(voicemail => {
                notifications.push({
                    id: voicemail.id,
                    lead_id: voicemail.lead_id,
                    lead_name: voicemail.lead_name,
                    type: 'message',
                    body: voicemail.url,
                    create_date: voicemail.createdAt,
                });
            });

            return notifications;
        } catch (error) {
            throw error;
        }
    }

    async getVoicemailsNotifications(user_id, lead_id) {
        let notifications = [];

        const voicemails = await CustomersVMRepository.getNotListenedCustomerVM(user_id, lead_id);

        voicemails.forEach(voicemail => {
            notifications.push({
                id: voicemail.id,
                lead_id: voicemail.lead_id,
                lead_name: voicemail.lead_name,
                type: 'message',
                body: voicemail.url,
                create_date: voicemail.createdAt,
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
                lead_name: message.lead_name,
                type: 'message',
                body: message.text,
                create_date: message.createdAt,
            });
        });

        return notifications;
    }
}

module.exports = new NotificationsService;