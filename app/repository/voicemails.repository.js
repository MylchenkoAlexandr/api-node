const db = require('../../database/models');

class VoiceMailsRepository {
    async getVoiceMails(user_id) {
        try {
            let data = await db.sequelize.query('SELECT avm.id, avm.voice_mail as url FROM agents_voice_mails avm WHERE avm.user_id = :user_id', {
                replacements: { user_id: user_id },
                type: db.sequelize.QueryTypes.SELECT
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new VoiceMailsRepository;