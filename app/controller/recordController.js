const models = require('../../database/models');
const { createRecord } = require('../services/record');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function fetchRecordsFromTwilioAndSaveToDB(req, res) {

    try {
        const recordings = await client.recordings.list({ from: '+18339282583', to: req.body.customerPhone });

        let records = [];

        if (recordings) {
            records = recordings.map(r => {
                return {
                    leadId: req.body.lead_id,
                    datatime: r.dateUpdated,
                    callSid: r.callSid,
                    sid: r.sid
                }
            });

            records.forEach(async r => {
                const recordExist = await models.Records.findOne({
                    where: {
                        call_sid: r.callSid,
                        sid: r.sid
                    }
                });

                if (!recordExist) {
                    createRecord(r);
                }
            })

            return res.status(200).json({
                message: 'Success'
            });
        }

    } catch (e) {
        console.error(e);
    }
    
    return res.status(400).json({
        message: 'Error'
    });
}

module.exports = {
    fetchRecordsFromTwilioAndSaveToDB
}