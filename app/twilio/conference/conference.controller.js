const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

class ConferenceController {
    addParticipant(req, res) {
        try {
            if ("lead_id" in req.body && "number" in req.body && "user_id" in req.body) {
                twilioClient.conferences(req.body.lead_id)
                    .participants
                    .create({
                        from: process.env.TWILIO_NUMBER,
                        to: req.body.number,
                        statusCallback: `${process.env.CALLBACK_TWILIO}/api/conference/participiant-status-callback/${req.body.user_id}`,
                    }).then(res => {
                        client.emit("send-second-part-params", { callSid: res.callSid, conferenceSid: res.conferenceSid }, req.body.user_id);
                    }).catch((err) => {
                        console.log(err);
                    });

                return res.status(200).send({ status: "success", message: "Calling second participiant!" });

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
                    .update({ hold: req.body.hold, holdUrl: 'https://demo.twilio.com/docs/classic.mp3' }).catch((err) => {
                        console.log(err);
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
            if ("conferenceSid" in req.body && "callSid" in req.body && "user_id" in req.body) {
                twilioClient.conferences(req.body.conferenceSid)
                    .participants(req.body.callSid)
                    .remove().then(() => {
                        client.emit("send-second-part-params", false, req.body.user_id);
                    }).catch((err) => {
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

    participiantStatusCallback(req, res) {
        try {
            if (req.body.CallStatus != 'answered' && req.params.user_id) {
                client.emit("send-second-part-params", false, req.params.user_id);
                return res.status(200).send({});
            }
            return res.status(400).send({});
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ConferenceController;