const db = require('../../database/models');

const MailRepository = {
    async getAll(lead_id) {
        try {
            const emails = await db.sequelize.query(`SELECT emails.id, users.fname, users.lname, emails.text, emails.createdAt FROM emails INNER JOIN users ON emails.user_id = users.id WHERE emails.lead_id = ${lead_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
            });

            return emails;
        } catch (error) {
            throw error;
        }
    },

    async getOne(email_id) {
        try {
            const email = await db.sequelize.query(`SELECT emails.id, users.fname, users.lname, emails.text, emails.createdAt FROM emails INNER JOIN users ON emails.user_id = users.id WHERE emails.id = ${email_id}`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            return email;
        } catch (error) {
            throw error;
        }
    },

    async create(email_params) {
        try {
            return await db.Emails.create({
                lead_id: +email_params.lead_id,
                user_id: +email_params.user_id,
                text: email_params.text
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = MailRepository;