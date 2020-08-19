const models = require('../../database/models/index');

/**
 * @param {*} req 
 * @param {*} res 
 */
async function createRecord(record) {
    try {
        await models.Records.create({
            lead_id: record.leadId,
            datetime: record.datatime,
            call_sid: record.callSid,
            sid: record.sid
        });
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    createRecord
}

