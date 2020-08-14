const models = require('../database/models/index');
// const { createRecord } = require('../services/record');

function getRecordsListFromTwilio(req, res) {
    client
        .calls
        .list({ status: 'completed', from: '+18339282583', to: '+13108769581' })
        .then(calls => calls.forEach(c => res.send(c.sid)))
        .catch(e => console.error(e));

    // createRecord();
}

/**
 * @param {*} req 
 * @param {*} res 
 */
async function getRecords(req, res) {
    try {
        const records = await models.Records.findAll({
            where: {
                lead_id: req.body.id
            }
        });

        if (records) {
            res.status(200).send({
                records
            });
        } else {
            res.status(204).send({
                message: 'Server error!'
            });
        }
    } catch (e) {
        res.status(400).send({
            message: 'Server error!'
        });
        console.error(e);
    }
}

module.exports = {
    getRecords,
    getRecordsListFromTwilio
}