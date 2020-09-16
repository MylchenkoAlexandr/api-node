const models = require('../../database/models');

class FormatService {
    async formatLead(lead) {
        const mandatoryFields = [
            "phone",
            "source",
            "type"
        ];

        if ((typeof lead) == 'object' || (typeof lead) == 'array') {
            mandatoryFields.forEach(field => {
                if (!lead[field]) {
                    throw new Error('Missed mandatory field: ' + field);
                }
            })

            try {
                if (lead.type) {
                    const type = await models.Types.findOne({
                        attributes: ['id'],
                        where: {
                            name: lead.type
                        }
                    })

                    if (type.id) {
                        delete lead.type;
                    }
                }

                if (lead.source) {
                    const source = await models.Source.findOne({
                        attributes: ['id'],
                        where: {
                            name: lead.source
                        }
                    })

                    if (source) {
                        delete lead.source;
                    }
                }

                if (lead.status) {
                    const status = await models.Statu.findOne({
                        attributes: ['id'],
                        where: {
                            name: lead.status
                        }
                    })

                    if (status) {
                        delete lead.status;
                    }
                }

                const formatedLead = {
                    status_id: status.id,
                    source_id: source.id,
                    type_id: type.id,
                    email: lead.email,
                    property: {
                        lead
                    }
                };

                console.log("FormatService -> formatLead -> formatedLead", formatedLead)

                return formatedLead;
            } catch (err) {
                throw new Error(err);
            }


        } else {
            throw new Error('Passed item is not array or object!');
        }
    }
}

module.exports = new FormatService;