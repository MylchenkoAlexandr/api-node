const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class ConferenceController {
    addParticipant(req, res) {
        try {
            if ("lead_id" in req.body && "number" in req.body) {
                twilioClient.conferences(req.body.lead_id)
                    .participants
                    .create({
                        from: process.env.TWILIO_NUMBER,
                        to: req.body.number,
                        endConferenceOnExit: true
                    }).then(res => {
                        client.emit("send-conf-params", { callSid: res.callSid, conferenceSid: res.conferenceSid });
                    }).catch((err) => {
                        console.log(err);
                    });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(200).send({ status: "error", message: "Server error" });
            throw error;
        }
    }
    handleParticipantHold(req, res) {
        try {
            if ("conferenceSid" in req.body && "callSid" in req.body && "hold" in req.body) {
                twilioClient.conferences(req.body.conferenceSid)
                    .participants(req.body.callSid)
                    .update({ hold: req.body.hold, holdUrl: 'https://api.twilio.com/cowbell.mp3' }).then(() => {
                        return res.send
                    }).catch((err) => {
                        console.log(err);
                        return false;
                    });

                const message = req.body.hold ? "Customer setted on hold" : "Customer removed from hold";

                return res.status(200).send({ status: "success", message: message });
            }
            return res.status(400).send({ status: "error", message: "Bad Request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Bad Request!" });
            throw error;
        }
    }

    removeParticipiant(req, res) {
        try {
            if ("conferenceSid" in req.body && "callSid" in req.body) {
                twilioClient.conferences(req.body.conferenceSid)
                    .participants(req.body.callSid)
                    .remove().catch((err) => {
                        console.log(err);
                    });

                return res.status(200).send({ status: "success", message: "Participiant removed from the call!" });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }
}

module.exports = new ConferenceController;