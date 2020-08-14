/**
 * @param {*} req 
 * @param {*} res 
 */
const createRecord = async function (record) {
    try {
        await models.Records.create({
            lead_id: record.lead_id,
            datetime: record.datetime,
            call_sid: record.call_sid,
            duration: record.duration,
            sid: record.sid
        });
    } catch (e) {
        console.error(e);
    }
}

module.exports = {
    createRecord
}

