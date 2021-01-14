const models = require('../../database/models');
const zipcodes = require('zipcodes');
const TransformationHelper = require('../helpers/transformation.helper');
const AgentRepository = require('../repository/agent.repository');

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
                });

                if (type) {
                    delete lead.type;
                }
            }

            if ("source" in lead) {
                source = await models.Sources.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.source
                    }
                });

                if (source) {
                    delete lead.source;
                }
            }

            let formatedLead = {
                source_id: source.id,
                type_id: type.id,
            }

            if ("state_id" in lead) {
                formatedLead.state_id = lead.state_id;
                if (formatedLead.state_id) {
                    delete lead.state_id;
                }
            }

            if ("email" in lead) {
                formatedLead.email = lead.email;
                delete lead.email;
            }

            if ("phone" in lead) {
                formatedLead.phone = lead.phone.replace(' ', '');
                delete lead.phone;
            }

            if ("zip" in lead) {
                lead.zipcode = lead.zip;
                delete lead.zip;
            }

            if (!("state" in lead) && "zipcode" in lead) {
                lead.state = zipcodes.lookup(lead.zip || lead.zipcode).state;
            }

            if ("state" in lead) {
                state = await models.States.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.state
                    }
                });
                if (state) {
                    formatedLead.state_id = state.id;
                }
            }

            if ("agent" in lead) {
                formatedLead.user_id = lead.agent;
                delete lead.agent;
            }

            // TODO commented out for that stage
            // else if ("state_id" in formatedLead) {
            //     if (!("user_id" in formatedLead) || formatedLead.user_id == null) {
            //         const suitableAgent = await AgentRepository.getAgentWithSmallestCountLeads(formatedLead.state_id);
            //         if (suitableAgent) {
            //             formatedLead.user_id = suitableAgent;
            //         }
            //     }
            // }

            if ("status" in lead) {
                status = await models.Status.findOne({
                    attributes: ['id'],
                    where: {
                        name: lead.status
                    }
                });
                if (status) {
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
            } else {
                formatedLead.fullname = lead.fullname;
                delete lead.fullname;
            }

            if ("empty" in lead) {
                formatedLead.empty = lead.empty;
                delete lead.empty;
            }

            let medications = [];
            const key_med = 'major_condition_';

            Object.keys(lead).forEach(key => {
                if (key == `${key_med}aids_hiv`) medications.push("1");
                if (key == `${key_med}alcohol_drug_abuse`) medications.push("2");
                if (key == `${key_med}alzheimers_dementia`) medications.push("3");
                if (key == `${key_med}asthma`) medications.push("4");
                if (key == `${key_med}cancer`) medications.push("5");
                if (key == `${key_med}clinical_depression`) medications.push("6");
                if (key == `${key_med}diabetes`) medications.push("7");
                if (key == `${key_med}emphysema`) medications.push("8");
                if (key == `${key_med}epilepsy`) medications.push("9");
                if (key == `${key_med}heart_attack`) medications.push("10");
                if (key == `${key_med}heart_disease`) medications.push("11");
                if (key == `${key_med}hepatitis_liver`) medications.push("12");
                if (key == `${key_med}high_blood_pressure`) medications.push("13");
                if (key == `${key_med}high_cholesterol`) medications.push("14");
                if (key == `${key_med}high_kidney_disease`) medications.push("15");
                if (key == `${key_med}mental_illness`) medications.push("16");
                if (key == `${key_med}multiple_sclerosis`) medications.push("17");
                if (key == `${key_med}pulmonary_disease`) medications.push("18");
                if (key == `${key_med}stroke`) medications.push("19");
                if (key == `${key_med}ulcers`) medications.push("20");
                if (key == `${key_med}vascular_disease`) medications.push("21");
                if (key == `${key_med}other`) medications.push("22");
                if (key.includes(key_med)) delete lead[key];
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

            if ("term" in lead && !("rate_class" in lead)) {
                lead.rate_class = lead.term == 'fex' ? 'lb' : 's';
            }

            if ("id" in lead) {
                delete lead.id;
            }
            if ("AD_procced" in lead) {
                delete lead.AD_procced;
            }
            if ("AD_status" in lead) {
                delete lead.AD_status;
            }

            if ("state_title" in lead) {
                delete lead.state_title;
            }
            if ("updated" in lead) {
                delete lead.updated;
            }
            if ("source_title" in lead) {
                delete lead.source_title;
            }
            if ("premium_price" in lead) {
                delete lead.premium_price;
            }
            if ("premium_carrier" in lead) {
                delete lead.premium_carrier;
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
    formatLeadForQuote(lead) {
        let formatedLead = {
            birthdate: lead.birth_date,
            state: lead.state,
            gender: lead.gender.toLowerCase(),
            smoker: Boolean(+lead.tobacco),
            coverage: lead.coverage_amount,
        };

        const term = this.formatTerms(lead);

        formatedLead.term = term;
        formatedLead.rate_class = lead.rate_class ? lead.rate_class : formatedLead.term == 'fex' ? 'lb' : 's';

        return formatedLead;
    }

    /**
     * Format row lead from csv file
     * @param {object} rawLead 
     * @param {string} source 
     * @param {string} type 
     */
    formatRawLead(rawLead, source, type) {
        rawLead.source = source;
        rawLead.type = type;
        rawLead.empty = 0;

        if ('city' in rawLead) delete rawLead.city;

        if (rawLead.contact) {
            rawLead.contact = rawLead.contact.replace(/"/ig, '');
        }

        if (rawLead.name) {
            rawLead.contact = rawLead.name.replace(/"/ig, '');
            delete rawLead.name;
        }

        if (rawLead.email == 'NULL' || rawLead.email == 0) {
            delete rawLead.email;
        } else {
            rawLead.email = rawLead.email.replace(/"/ig, '');
        }

        let newDate = false;

        if ('birth_date' in rawLead) {
            newDate = rawLead.birth_date == 0 || rawLead.birth_date == 'NULL' ? false : new Date(rawLead.birth_date);

        } else if ('dob' in rawLead) {
            newDate = rawLead.dob == 0 || rawLead.dob == 'NULL' ? false : new Date(rawLead.dob);
        }

        if ('dob' in rawLead) delete rawLead.dob

        if (newDate) {
            const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
            const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
            const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);

            rawLead.birth_date = yy + '-' + mm + '-' + dd;
        } else {
            if ('birth_date' in rawLead) delete rawLead.birth_date
        }

        if (rawLead.phone != 0 || rawLead.phone != 'NULL') {
            let clearPhone = String(rawLead.phone).length == 11 ? String(rawLead.phone).substring(1) : rawLead.phone;

            rawLead.phone = TransformationHelper.phoneNumber(clearPhone).toString();
        } else {
            delete rawLead.phone;
        }

        if ('gender' in rawLead) {
            const gender = rawLead.gender == 0 || rawLead.gender == 'NULL' ? false : rawLead.gender.charAt(0);

            if (gender) {

                rawLead.gender = gender.toLowerCase();
            } else {
                delete rawLead.gender;
            }
        }

        if ('coverage_length' in rawLead && 'product_type' in rawLead) {
            if (rawLead.coverage_length != 0 && rawLead.coverage_length != 'NULL') {
                rawLead.term = rawLead.coverage_length;
                delete rawLead.coverage_length;
            } else {
                rawLead.term = rawLead.product_type;
                delete rawLead.product_type;
            }
        }

        if ("smoker" in rawLead) {
            rawLead.tobacco = rawLead.smoker;
            delete rawLead.smoker;
        }

        return rawLead;
    }

    /**
     * Get term from lead and return correct value for quoter
     * @param {object} lead 
     * @returns {string} correctTerm
     */
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