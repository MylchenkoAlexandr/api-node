
const models = require('../../database/models')

function parseCSVfileToDB(rowLeadsJSON) {
    return new Promise((resolve, reject) => {
        let idArray = [];

        Object.keys(rowLeadsJSON).forEach(async key => {
            try {
                let exist = await models.Leads.findOne({
                    where: {
                        email: rowLeadsJSON[key].email
                    }
                })

                if (exist)
                    return;

                let clearPhone = String(rowLeadsJSON[key].phone).length == 11 ? String(rowLeadsJSON[key].phone).substring(1) : rowLeadsJSON[key].phone

                rowLeadsJSON[key].phone = formatPhoneNumber(clearPhone).replace(' ', '');

                rowLeadsJSON[key].source = "blueberry";
                rowLeadsJSON[key].type = "life";
                rowLeadsJSON[key].status = "new";

                let newDate = new Date(rowLeadsJSON[key].birth_date);

                const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
                const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
                const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);

                rowLeadsJSON[key].birth_date = yy + '-' + mm + '-' + dd;

                let rowLead = await models.Leads.create({
                    status_id: 1,
                    source_id: 1,
                    type_id: 2,
                    empty: 1,
                    fullname: rowLeadsJSON[key].contact,
                    email: rowLeadsJSON[key].email,
                    property: JSON.stringify(rowLeadsJSON[key]),
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

function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '')
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('')
    }
    return null
}

module.exports = {
    parseCSVfileToDB
}