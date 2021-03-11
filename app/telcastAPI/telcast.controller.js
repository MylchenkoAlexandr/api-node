const TelcastService = require('./telcast.service');

class TelcastController {
    index(req, res){
        TelcastService.sendLead();
    }
}

module.exports = new TelcastController();