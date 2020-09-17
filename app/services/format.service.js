const models = require('../../database/models');
const zipcodes = require('zipcodes');
const _ = require('lodash');

class FormatService {
    /**
     * Function for formating and structure lead  
     * @param {object} lead
     */
    async formatLead(lead) {
        if (lead.length <= 0) {
            throw new Error('Lead object is empty!');
        }

        const mandatoryFields = [
            "phone",
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
            let source, status, type, email, phone, state, fullname;

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

            if ("email" in lead) {
                email = lead.email;
                delete lead.email;
            }

            if ("phone" in lead) {
                phone = lead.phone;
                delete lead.phone;
            }

            let formatedLead = {
                source_id: source.id,
                type_id: type.id,
                email: email,
                phone: phone.replace(' ', '')
            }

            if (!("state" in lead)) {
                lead.state = zipcodes.lookup(lead.zipcode || lead.zipcode);
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

        let term = 10;

        if ("coverage_type" in lead) {
            switch (lead.coverage_type) {
                case 'Term 10 Years':
                    term = '10';
                    break;
                case 'Term 15 Years':
                    term = '15';
                    break;
                case 'Term 20 Years':
                    term = '20';
                    break;
                case 'Term 25 Years':
                    term = '25';
                    break;
                case 'Term 30 Years':
                    term = '30';
                    break;
                case 'Final Expense':
                    term = 'fex';
                    break;
            }
        } else {
            term = lead.term;
        }

        formatedLead.term = term;
        formatedLead.rate_class = formatedLead.term == 'fex' ? 'lb' : 's';

        return formatedLead;
    }
}

module.exports = new FormatService;