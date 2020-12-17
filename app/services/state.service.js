const models = require('../../database/models');
const PhoneService = require('./phone.service');
class StateService {
    async getAll() {
        try {
            const states = await models.States.findAll();
            return states;
        } catch (error) {
            throw error;
        }
    }

    async getStateIdFromPhone(phone) {
        let code = PhoneService.getAreaCodeFromPhone(phone);

        let state = false;

        const phones = await models.Phones.findAll();

        phones.forEach(element => {
            if (element.codes) {
                let coorrectCode = element.codes.search(code);
                if (coorrectCode != -1) {
                    state = element.state_id;
                }
            }
        });

        return state;
    }
}

module.exports = new StateService;