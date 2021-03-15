const TelcastService = require('./telcast.service');

class TelcastController {
    index(req, res){
        try {
            // find the list of leads
            TelcastService.request();

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TelcastController();