const db = require('../../database/models');

class FollowUpsRepository {
    async getOneByID(id) {
        try {
            let data = await db.sequelize.query("SELECT followups.id, leads.fullname, followups.lead_id, followups.priority, followups.datetime, followups.description, followups.completed FROM followups INNER JOIN leads ON leads.id = followups.lead_id WHERE followups.id = :id", {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: {
                    id: id
                },
                plain: true
            });

            let prior;

            switch (data.priority) {
                case 1:
                    prior = "High";
                    break;
                case 2:
                    prior = "Medium";
                    break;
                case 3:
                    prior = "Low";
                    break;
            }

            data.priority = prior;

            data.completed = data.completed ? "Completed" : "Not Completed";

            return data;
        } catch (error) {
            throw error;
        }
    }
    async getByUserId(user_id) {
        try {
            let data = await db.sequelize.query("SELECT followups.id, leads.fullname, followups.lead_id, followups.priority, followups.datetime, followups.description, followups.completed FROM followups INNER JOIN leads ON leads.id = followups.lead_id WHERE followups.user_id = :user_id", {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: {
                    user_id: user_id
                }
            });

            data.forEach(item => {
                let prior;
                switch (item.priority) {
                    case 1:
                        prior = "High";
                        break;
                    case 2:
                        prior = "Medium";
                        break;
                    case 3:
                        prior = "Low";
                        break;
                }
                item.priority = prior;

                item.completed = item.completed ? "Completed" : "Not Completed";
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
    async filter(params) {

    }

    async filterParams(user_id) {
        let fullnames = await db.sequelize.query("SELECT leads.fullname FROM followups INNER JOIN leads ON leads.id = followups.lead_id WHERE followups.user_id = :user_id GROUP BY leads.fullname ORDER BY leads.fullname", {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: {
                user_id: user_id
            },
        });
        let fullnamesParams = [];

        fullnames.forEach(item => {
            if (item.fullname) {
                fullnamesParams.push(item.fullname);
            }
        });

        let datetimeParams = [];
        const datetime = await db.sequelize.query("SELECT followups.datetime FROM followups WHERE followups.user_id = :user_id", {
            type: db.sequelize.QueryTypes.SELECT,
            replacements: {
                user_id: user_id
            },
        });

        datetime.forEach(item => {
            datetimeParams.push(item.datetime);
        });

        return {
            fullnamesParams,
            datetimeParams,
            status: [
                "Not Completed",
                "Completed"
            ]
        }
    }
}

module.exports = new FollowUpsRepository;