const models = require('../../database/models')

class UploadService {
    parseCSVfileToDB(rowLeadsJSON) {
        return new Promise((resolve, reject) => {
            let idArray = [];

            Object.keys(rowLeadsJSON).forEach(async key => {
                try {
                    let lead;
                    let formatedLead = this.formatLead(rowLeadsJSON[key]);

                    if (formatedLead.email) {
                        let exist = await models.Leads.findOne({
                            where: {
                                email: rowLeadsJSON[key].email
                            }
                        });

                        if (exist) {
                            lead = await this.updateLead(exist);
                        } else {
                            lead = await this.createLead(formatedLead);
                        }
                    } else {
                        lead = await this.createLead(formatedLead);
                    }

                    if (lead.id) {
                        idArray.push(lead.id);

                        if (rowLeadsJSON.length == idArray.length) {
                            resolve(idArray);
                        }
                    }

                } catch (err) {
                    console.log(err)
                    reject(err)
                }
            });
        })
    }

    formatLead(rowLead) {
        if (rowLead.email == 0 && rowLead.email != 'NULL') {
            delete rowLead.email
        } else {
            rowLead.email = rowLead.email.replace(/"/ig, '');
        }

        if (rowLead.contact != 0 && rowLead.contact != 'NULL') {
            rowLead.contact = rowLead.contact.replace(/"/ig, '');
        } else {
            delete rowLead.contact;
        }

        if (rowLead.phone != 0 && rowLead.phone != 'NULL') {
            let clearPhone = String(rowLead.phone).length == 11 ? String(rowLead.phone).substring(1) : rowLead.phone;
            rowLead.phone = this.formatPhoneNumber(clearPhone).replace(' ', '');
        } else {
            delete rowLead.phone;
        }

        // if (rowLead.birth_date != 0 && rowLead.birth_date != 'NULL') {
        //     let newDate = new Date(rowLead.birth_date);
        //     const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
        //     const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
        //     const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);
        //     rowLead.birth_date = yy + '-' + mm + '-' + dd;
        // } else {
        //     delete rowLead.birth_date;
        // }

        rowLead.source = "blueberry";
        rowLead.type = "life";
        rowLead.status = "new";

        return rowLead;
    }

    formatPhoneNumber(phoneNumberString) {
        let cleaned = ('' + phoneNumberString).replace(/\D/g, '');

        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            let intlCode = (match[1] ? '+1 ' : '');

            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        }
    }

    async createLead(formatedLead) {
        const lead = await models.Leads.create({
            status_id: 1,
            source_id: 1,
            type_id: 2,
            empty: 1,
            fullname: formatedLead.contact,
            email: formatedLead.email,
            property: JSON.stringify(formatedLead),
        });

        return lead;
    }

    async updateLead(lead) {
        const exLead = await lead.update({
            fullname: lead.contact,
            property: JSON.stringify(lead),
        });

        return exLead;
    }
}
module.exports = new UploadService();