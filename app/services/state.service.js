const models = require('../../database/models');

class StateService {
    async getAll(){
        try {        
            const states = await models.States.findAll();
            return states;
        } catch (error) {
            throw error;        
        }
    }
}

module.exports = new StateService;