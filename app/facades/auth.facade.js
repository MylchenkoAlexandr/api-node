const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../../database/models');

const AgentService = require('../services/agent.service');

class AuthFacade {
    async login(email, password) {
        try {
            const user = await AgentService.find(email);
            if (user) {
                const user_banned = await AgentService.checkedBan(email);
                if (user_banned) return { code: 403, status: 'error', message: "Your account has been banned" };

                const password_mathes = await bcrypt.compare(password, user.password);
                if (password_mathes) {
                    const acces_token = jwt.sign({ data: email }, process.env.SECRET_KEY, { expiresIn: "365d" });

                    let subroles = [];

                    const userSubroles = await models.UsersSubroles.findAll({
                        where: { user_id: user.id }
                    });

                    userSubroles.map(item => subroles.push(item.subrole_id));
                    return {
                        code: 200,
                        status: "success",
                        message: "Login success",
                        user: {
                            id: user.id,
                            online: user.online,
                            email: user.email,
                            fname: user.fname,
                            lname: user.lname,
                            phone: user.phone,
                            voice_mail: user.voice_mail,
                            text_message: user.text_message,
                            twilio_phone: user.twilio_phone,
                            states: JSON.parse(user.states),
                            role_id: user.role_id,
                            uncompleted_lead: user.uncompleted_lead,
                            subroles: subroles
                        },
                        token: acces_token
                    }
                }
            }

            return { code: 400, status: 'error', message: "Password or email incorrect" };
        } catch (error) {
            throw error;
        }
    }

    async verify(jwt_token) {
        try {
            const { err, data: email } = jwt.verify(jwt_token, process.env.SECRET_KEY);

            if (err) return { code: 403, status: 'error', message: 'Session end' }
            const account_banned = await AgentService.checkedBan(email);
            if (account_banned) return { code: 403, status: 'error', message: "Your account has been banned" };

            const candidate = await AgentService.find(email);
            if (candidate) {
                let subroles = [];

                const userSubroles = await models.UsersSubroles.findAll({
                    where: { user_id: candidate.id }
                });

                userSubroles.map(item => subroles.push(item.subrole_id));
            
                return {
                    code: 200,
                    status: "success",
                    message: "Verify success",
                    user: {
                        id: candidate.id,
                        online: candidate.online,
                        email: candidate.email,
                        fname: candidate.fname,
                        lname: candidate.lname,
                        phone: candidate.phone,
                        voice_mail: candidate.voice_mail,
                        text_message: candidate.text_message,
                        twilio_phone: candidate.twilio_phone,
                        states: JSON.parse(candidate.states),
                        role_id: candidate.role_id,
                        uncompleted_lead: candidate.uncompleted_lead,
                        subroles: subroles
                    }
                };
            }

            return { code: 403, status: 'error', message: "Not authenticated" };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new AuthFacade;