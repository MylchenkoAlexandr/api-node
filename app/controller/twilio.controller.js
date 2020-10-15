const TwilioService = require('../services/twilio.service');

class TwilioController {
    outboundCall (req, res) {
        TwilioService.outboundCall();
        return res.sendStatus(200);
    }
 
    AMD (req, res) {
        console.log(req.body.AnsweredBy);
        if(req.body.AnsweredBy == "human"){
            // find a suitable GUIDE
            
            // if guide === false 
                // transfer call to IVR
            // else 
                // transfer call to GUIDE
        } else{
            console.log("USER SMS TEXT")
        }
        return res.sendStatus(200);
    }
}

module.exports = new TwilioController;