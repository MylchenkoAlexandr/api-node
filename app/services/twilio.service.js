const models = require('../../database/models');
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class TwilioService {
    outboundCall() {
        client.calls.create({
            asyncAmd: "true",
            machineDetection: 'Enable',
            asyncAmdStatusCallback: 'https://f9b782710729.ngrok.io/api/twilio/amd',
            // twiml: '<Response><Say>Hello it`s Blueberry!</Say></Response>',
            url: 'http://demo.twilio.com/docs/classic.mp3',
            machineDetectionSilenceTimeout: 10000,
            from: process.env.TWILIO_NUMBER,
            to: "+13108769581"
        }).then(call => {
            console.log(call)
        });
    }
    // AMD(status) {
    //     console.log(status);
    // }
}

module.exports = new TwilioService;