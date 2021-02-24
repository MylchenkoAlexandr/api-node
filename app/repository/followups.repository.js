const db = require('../../database/models');

class FollowUpsRepository {
    async getOneByID(id) {
        try {
            let data = await db.sequelize.query("SELECT followups.id, leads.fullname, followups.user_id, CONCAT(users.fname, ' ', users.lname) as agentName, followups.lead_id, followups.priority, followups.datetime, followups.description, followups.completed FROM followups INNER JOIN leads ON leads.id = followups.lead_id LEFT JOIN users on followups.user_id = users.id WHERE followups.id = :id", {
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

            data.completed = data.completed ? "Completed" : "In Progress";

            return data;
        } catch (error) {
            throw error;
        }
    }
    async getByUserId(user) {
        try {
            let sql = "SELECT followups.id, leads.fullname, followups.lead_id, followups.user_id, CONCAT(users.fname, ' ', users.lname) as agentName, followups.priority, followups.datetime, followups.description, followups.completed FROM followups INNER JOIN leads ON leads.id = followups.lead_id LEFT JOIN users on followups.user_id = users.id";

            sql += user.role_id !== 1 ? " WHERE followups.user_id = " + user.id : "";

            let data = await db.sequelize.query(sql, {
                type: db.sequelize.QueryTypes.SELECT,
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

                item.completed = item.completed ? "Completed" : "In Progress";
            });

            return data;
        } catch (error) {
            throw error;
        }
    }

    async filter(params) {
        let where = '';

        if (params.status.length) {
            where += '('
            params.status.forEach((status, idx) => {
                where += idx !== params.status.length - 1 ? 'leads.status_id=' + status + ' OR ' : 'leads.status_id=' + status;
            });
            where += ') AND ';
        } else {
            where += 'followups.completed=-1 AND ';
        }

        if (params.lead.length) {
            where += '('
            params.lead.forEach((lead, idx) => {
                where += idx !== params.lead.length - 1 ? 'followups.lead_id=' + lead + ' OR ' : 'followups.lead_id=' + lead;
            });
            where += ') AND ';
        } else {
            where += 'followups.lead_id=-1 AND ';
        }

        if (params.user.length) {
            where += '('
            params.user.forEach((user, idx) => {
                where += idx !== params.user.length - 1 ? 'followups.user_id=' + user + ' OR ' : 'followups.user_id=' + user;
            });
            where += ') AND ';
        } else {
            where += 'followups.user_id=-1 AND ';
        }

        if (params.dateTime.length) {
            where += '('
            params.dateTime.forEach((dateTime, idx) => {
                where += idx !== params.dateTime.length - 1 ? 'followups.datetime="' + dateTime + '" OR ' : 'followups.datetime="' + dateTime + '"';
            });
            where += ') AND ';
        } else {
            where += 'followups.datetime="" AND ';
        }

        let sql = `SELECT followups.id, leads.fullname, leads.status_id, followups.user_id, CONCAT(users.fname, ' ', users.lname) as agentName, followups.lead_id, status.id as status_id, status.title as s_title, followups.priority, followups.datetime, followups.description, followups.completed FROM followups INNER JOIN leads ON leads.id = followups.lead_id LEFT JOIN users on followups.user_id = users.id INNER JOIN status on status.id = leads.status_id WHERE followups.completed = 0 AND ${where}`;

        sql = sql.substr(0, sql.length - 5);

        let data = await db.sequelize.query(sql, {
            type: db.sequelize.QueryTypes.SELECT,
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

            item.completed = item.completed ? "Completed" : "In Progress";
        });

        return data;
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
                "In Progress",
                "Completed"
            ]
        }
    }
}

module.exports = new FollowUpsRepository;