const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

class TelcastService {
    request(lead) {
        try {
            const URL = process.env.TELCAST_API_URL;
            const params = new URLSearchParams();
            params.append("a", 1);

            console.log(URL, params);
            return 0;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TelcastService();