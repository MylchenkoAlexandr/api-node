const fetch = require('node-fetch');
const request = require('request');
const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: '../../logs/telcast/err_telcast.log', level: 'error' }),
        new winston.transports.File({ filename: '../../logs/telcast/inf_telcast.log' }),
    ],
});

class TelcastService {
    request(lead) {
        try {
            const url = process.env.TELCAST_API_URL;
            const params = { a: 1 };

            request({ url: url, qs: params }, function (err, response, body) {
                if (err) { console.log(err); return; }
                console.log("🚀 ~ file: telcast.service.js ~ line 12 ~ TelcastService ~ body", body)
            });
            return 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TelcastService();