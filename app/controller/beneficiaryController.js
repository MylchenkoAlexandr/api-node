const models = require('../../database/models');
const BeneficiaryRepository = require('../repository/BeneficiaryRepository');

async function createBeneficiary(req, res) {
    try {
        const beneficiary = await models.Beneficiaries.findOne({
            where: { lead_id: req.body.lead_id }
        });

        const state = await models.States.findOne({
            where: { name: req.body.location }
        });

        if (beneficiary) {
            await beneficiary.update({
                name: req.body.name,
                relative_id: req.body.relative_id,
                location_id: state.id,
                grand_kids: req.body.grand_kids,
                work_status: req.body.work_status
            });

            return res.status(200).json({
                message: "Beneficiary updated"
            });
        } else {
            await models.Beneficiaries.create({
                lead_id: req.body.lead_id,
                name: req.body.name,
                relative_id: req.body.relative_id,
                location_id: state.id,
                grand_kids: req.body.grand_kids,
                work_status: req.body.work_status
            });

            return res.status(201).json({
                message: "Beneficiary created"
            });
        }

    } catch (error) {
        console.log("createBeneficiary -> error", error)
    }

    return res.status(400).json({
        message: "Server error"
    });
}

async function getBeneficiary(req, res) {
    try {
        const beneficiary = await BeneficiaryRepository.getOne(req.params.lead_id);

        if (beneficiary) {
            return res.status(200).json(beneficiary);
        }

        return res.sendStatus(204);
    } catch (error) {
        console.log("getBeneficiary -> error", error)
    }

    return res.status(400).json({
        message: "Server error"
    });
}

module.exports = {
    createBeneficiary,
    getBeneficiary
}