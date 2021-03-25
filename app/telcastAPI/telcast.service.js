const request = require('request');
const winston = require('winston');

/**
 * Logged with params
 */
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/telcast.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} ${info.id} : "${info.message.trimEnd()}"`;
        })
    ),
});

class TelcastService {
    sendLead(lead) {
        try {
            const url = process.env.TELCAST_API_URL;

            let list_id;

            if (lead.type_id == 2) {
                list_id = 1004;
            } else if (lead.type_id == 4) {
                list_id = 1005;
            }

            const params = {
                source: "api",
                user: process.env.TELCAST_API_USER,
                pass: process.env.TELCAST_API_PASS,
                function: "add_lead",
                phone_number: lead.phone,
                list_id: list_id,
                custom_fields: "Y",
                lead_type: lead.source_title,
                lead_status: lead.status_title,
                duplicate_check: "DUPLIST"
            };

            if (lead.fullname) {
                const fullname = lead.fullname.split(" ");
                params.first_name = fullname[0];
                params.last_name = fullname[1];
            }

            lead.address ? params.address1 = lead.address : false;
            lead.city ? params.city = lead.city : false;
            lead.state ? params.state = lead.state : false;
            lead.zipcode ? params.postal_code = lead.zipcode : false;
            lead.gender ? params.gender = lead.gender : false;
            lead.birth_date ? params.date_of_birth = lead.birth_date : false;
            lead.email ? params.email = lead.email : false;

            console.log(params);

            request({ url: url, qs: params }, function (err, response, body) {
                if (err) {
                    logger.log({ level: "error", id: lead.id, message: body });
                    return;
                }

                logger.log({ level: "info", id: lead.id, message: body });
            });

            return 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TelcastService();