class ConferenceService {
    addParticipant(lead_id, number, callSid, conferenceSid) {
        try {
            twilioClient.conferences(lead_id)
                .participants
                .create({
                    from: process.env.TWILIO_NUMBER,
                    to: number,
                    endConferenceOnExit: true
                }).then(() => {
                    client.emit("send-conf-params", { callSid: callSid, conferenceSid: conferenceSid });
                    return true;
                }).catch((err) => {
                    console.log(err);
                    return false;
                });
        } catch (error) {
            throw error;
        }
    }

    disconnectParticipant(conferenceSid, callSid) {
        try {
            return true;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ConferenceService;