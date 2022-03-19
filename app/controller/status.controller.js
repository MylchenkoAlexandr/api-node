const StatusService = require('../services/status.service');
const winston = require("winston");

/**
 * Logged with params
 */
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/status.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(info => {
            return `${info.timestamp} (${info.row}): "${info.message.trimEnd()}"`;
        })
    ),
});

class StatusController {
    async getAll(req, res){

        logger.log({ level: "info", row: '23', message: `get all statuses` });

        try {
            const statuses = await StatusService.getAll();

            if(statuses){
                return res.status(200).json({ statuses: statuses });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new StatusController;