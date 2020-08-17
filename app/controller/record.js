const models = require('../database/models/index');
const { createRecord } = require('../services/record');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function fetchRecordsFromTwilioAndSaveToDB(req, res) {
    const responce = {
        code: 204,
        message: 'Server error!'
    };

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

            responce.code = 200;
            responce.message = 'Success';
        }

        res.status(responce.code).send({
            message: responce.message
        });
    } catch (e) {
        console.error(e);
        res.status(responce.code).send({
            message: responce.message
        });
    }
}

module.exports = {
    fetchRecordsFromTwilioAndSaveToDB
}