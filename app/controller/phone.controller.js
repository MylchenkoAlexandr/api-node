const PhoneService = require('../services/phone.service');

class PhoneController {
    async get(req, res) {        
        try {
            if ("id" in req.params) {
                const phone = await PhoneService.get(req.params.id);
                return res.status(200).json({ status: 'success', message: 'Success', phone: phone });
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }

    async update(req, res) {
        try {
            if ("id" in req.body && "updated" in req.body) {
                const exist = await PhoneService.get(req.body.id);
                if (exist) {
                    const responce = await PhoneService.update(exist, req.body.updated);
                    return res.status(responce.code).json({ status: responce.status, message: responce.message });
                }
            }

            return res.status(400).json({ status: 'error', message: 'Bad Request' });
        } catch (error) {
            res.status(500).json({ status: 'error', message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new PhoneController;