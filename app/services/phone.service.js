const models = require('../../database/models');
const SettingsService = require('../services/settings.service');

class PhoneService {
    async get(id) {
        try {
            const phone = await models.Phones.findOne({
                where: {
                    state_id: id
                }
            });

            return phone;
        } catch (error) {
            throw error;
        }
    }

    async getByAreaCode(code) {
        try {
            let phone;
            const phones = await models.Phones.findAll();

            phones.forEach(element => {
                if (element.codes) {
                    let coorrectCode = element.codes.search(code);
                    if (coorrectCode != -1) {
                        phone = element;
                    }
                }
            });
            return phone;
        } catch (error) {
            throw error;
        }
    }

    async update(exist, updated) {
        try {
            await exist.update({
                codes: JSON.stringify(updated.codes),
                phone: updated.phone
            })

            return { code: 200, status: "success", message: "Updated" };
        } catch (err) {
            throw err
        }
    }

    async pickPhoneNumberByArea(lead) {
        let settings = await SettingsService.get();
        let phone = settings.default_phone;
        let areaPhone;

        if ("state_id" in lead) {
            areaPhone = await this.get(lead.state_id);
        } else {
            let areaCode = this.getAreaCodeFromPhone(lead.phone);
            areaPhone = await this.getByAreaCode(areaCode);
        }

        if (areaPhone.phone) {
            phone = areaPhone.phone;
        }

        return phone;
    }

    getAreaCodeFromPhone(phone) {
        let range = [1, 4];

        if (phone[0] == "+") {
            range = [3, 6];
        }
        return phone.slice(range[0], range[1]);
    }
}

module.exports = new PhoneService;