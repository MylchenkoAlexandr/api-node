
const models = require('../../database/models')

function parseCSVfileToDB(rowLeadsJSON) {
    return new Promise((resolve, reject) => {
        let idArray = [];

        Object.keys(rowLeadsJSON).forEach(async key => {
            try {
                let exist = await models.RowLeads.findOne({
                    where: {
                        email: rowLeadsJSON[key].email
                    }
                })

                if (exist)
                    return;

                let rowLead = await models.RowLeads.create({
                    fullname: rowLeadsJSON[key].name,
                    email: rowLeadsJSON[key].email,
                    phone: rowLeadsJSON[key].phone,
                    dob: new Date(rowLeadsJSON[key].dob),
                })

                idArray.push(rowLead.id);

                if (rowLeadsJSON.length == idArray.length) {
                    resolve(idArray);
                }
            } catch (err) {
                reject(err)
            }
        });
    })
}

module.exports = {
    parseCSVfileToDB
}