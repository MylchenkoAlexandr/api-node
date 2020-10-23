const TwilioService = require('../services/twilio.service');

class TwilioController {
    outboundCall(req, res) {
        TwilioService.outboundCall();
        return res.sendStatus(200);
    }

    async AMD(req, res) {
        await TwilioService.AMD(req.body, req.get('host'));
        return res.sendStatus(200);
    }
    
    token(req, res){
        let token = TwilioService.capabilityGenerator(req.body.workerId);
        
        return res.status(200).json({
            token: token
        });
    }
}

module.exports = new TwilioController;