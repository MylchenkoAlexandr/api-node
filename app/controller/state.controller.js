const StateService = require('../services/state.service');
class StateController {
    async getAll(req, res){
        try {            
            const states = await StateService.getAll();

            if(states){
                return res.status(200).json({states: states });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new StateController;