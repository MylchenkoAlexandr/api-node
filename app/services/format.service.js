const models = require('../../database/models');
const zipcodes = require('zipcodes');
const TransformationHelper = require('../helpers/transformation.helper');

class FormatService {
    /**
     * Function for formating and structure lead  
     * @param {object} lead
     */
    async formatLead(lead) {
        if (lead.length <= 0) {
            throw new Error('Lead object is empty!');
        }

        if (!("email" in lead) && !("phone" in lead)) {
            throw new Error("Phone and Email is empty, lead is invalid");
        }

        const mandatoryFields = [
            "source",
            "type"
        ];

        // Try to find mandatory fields in lead
        mandatoryFields.forEach(index => {
            if (!(index in lead)) {
                throw new Error('Missed mandatory field: ' + index);
            }
        });

        /**
         * !! Setting values you can find inside IF statements
         * Fetching all usefull fields:
         *  - status_id
         *  - source_id
         *  - type_id
         *  - user_id
         *  - state_id
         *  - empty
         *  - fullname
         *  - medication
         */
        try {
            let source, status, type, state, fullname;

            if ("type" in lead) {
                type = await models.Types.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.type

                    }
                })

                if (type.dataValues.id) {
                    delete lead.type;
                }
            }

            if ("source" in lead) {
                source = await models.Sources.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.source
                    }
                })

                if (source.dataValues.id) {
                    delete lead.source;
                }
            }

            let formatedLead = {
                source_id: source.id,
                type_id: type.id,
            }

            if ("email" in lead) {
                formatedLead.email = lead.email;
                delete lead.email;
            }

            if ("phone" in lead) {
                formatedLead.phone = lead.phone.replace(' ', '');
                delete lead.phone;
            }

            if (!("state" in lead) && ("zip" in lead || "zipcode" in lead)) {
                lead.state = zipcodes.lookup(lead.zip || lead.zipcode).state;
            }

            if ("state" in lead) {
                state = await models.States.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.state
                    }
                });

                if (state.dataValues.id) {
                    formatedLead.state_id = state.id;
                }
            }

            if ("agent" in lead) {
                formatedLead.user_id = lead.agent;
            }

            if ("status" in lead) {
                status = await models.Status.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.status
                    }
                })

                if (status.dataValues.id) {
                    delete lead.status;
                    formatedLead.status_id = status.id;
                }
            } else {
                formatedLead.status_id = 1;
            }

            if (!("fullname" in lead)) {
                if ("contact" in lead) {
                    fullname = lead.contact;

                    if (fullname) {
                        delete lead.contact;
                    }
                } else if ("fname" in lead && "lname" in lead) {
                    fullname = lead.fname + ' ' + lead.lname;

                    if (fullname) {
                        delete lead.fname;
                        delete lead.lname;
                    }
                }

                if (fullname) {
                    formatedLead.fullname = fullname;
                }
            }

            if ("empty" in lead) {
                formatedLead.empty = lead.empty;
                delete lead.empty;
            }

            let medications = [];

            Object.keys(lead).forEach(key => {
                if (key.includes("major_condition_")) {
                    medications.push({ [key]: lead[key] });
                    delete lead[key];
                }
            });

            if (medications.length > 0) {
                lead.medications = medications;
            }

            if ("type" in lead || "coverage_type" in lead) {
                lead.term = this.formatTerms(lead);

                if ("coverage_type" in lead) {
                    delete lead.coverage_type;
                }
            }

            formatedLead.property = {
                ...lead
            }

            return formatedLead;
        } catch (err) {
            throw err;
        }
    }

    /**
     * Function for formating lead data for quoters
     * @param {object} lead 
     */
    async formatLeadForQuote(lead) {
        let formatedLead = {
            birthdate: lead.birth_date,
            state: lead.state,
            gender: lead.gender.toLowerCase(),
            smoker: Boolean(+lead.tobacco),
            coverage: lead.coverage_amount
        };

        const term = this.formatTerms(lead);

        formatedLead.term = term;
        formatedLead.rate_class = formatedLead.term == 'fex' ? 'lb' : 's';

        return formatedLead;
    }

    /**
     * Format row lead from csv file
     * @param {object} rawLead 
     * @param {string} sourece 
     * @param {string} type 
     */
    async formatRawLeads(rawLead, source, type) {
        Object.keys(rawLead).forEach(async index => {
            rawLead[index].source = source;
            rawLead[index].type = type;

            if (rawLead[index].contact) {
                rawLead[index].contact = rawLead[index].contact.replace(/"/ig, '');
            }

            if (rawLead[index].email != 'NULL' || rawLead[index].email != 0) {
                rawLead[index].email = rawLead[index].email.replace(/"/ig, '');
            } else {
                delete rawLead[index].email
            }

            if (rawLead[index].birth_date != 0 && rawLead[index].birth_date != 'NULL') {
                let newDate = new Date(rawLead[index].birth_date);
                const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
                const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
                const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);
                rawLead[index].birth_date = yy + '-' + mm + '-' + dd;
            } else {
                delete rawLead.birth_date;
            }

            if (rawLead[index].phone != 0 && rawLead[index].phone != 'NULL') {
                let clearPhone = String(rawLead[index].phone).length == 11 ? String(rawLead[index].phone).substring(1) : rawLead[index].phone;
                rawLead[index].phone = TransformationHelper.phoneNumber(clearPhone).replace(' ', '');
            } else {
                delete rawLead[index].phone;
            }

            rawLead[index] = await this.formatLead(rawLead[index]);
        });

        return rawLead;
    }

    formatTerms(lead) {
        let correctTerm;
        if ("coverage_type" in lead) {
            switch (lead.coverage_type) {
                case 'Term 10 Years':
                    correctTerm = '10';
                    break;
                case 'Term 15 Years':
                    correctTerm = '15';
                    break;
                case 'Term 20 Years':
                    correctTerm = '20';
                    break;
                case 'Term 25 Years':
                    correctTerm = '25';
                    break;
                case 'Term 30 Years':
                    correctTerm = '30';
                    break;
                case 'Final Expense':
                    correctTerm = 'fex';
                    break;
            }
        } else if ("term" in lead) {
            correctTerm = lead.term;
        }

        return correctTerm;
    }
}

module.exports = new FormatService;