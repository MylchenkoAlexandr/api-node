const models = require('../database/models');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);

describe('Leads Proccess check', () => {
    it('MediaAlpha lead upload', async done => {
        const MediaAlphaLead = {
            "lead": {
                "address": "120 Jenkins Rd",
                "address_2": "",
                "birth_date": "1970-05-19",
                "contact": "Micky Mouse",
                "coverage_amount": "500000",
                "coverage_type": "Term 20 Years",
                "credit_rating": "",
                "current_company": "Other",
                "currently_insured": 1,
                "dui": 1,
                "email": "mmouse@gmail.com",
                "gender": "F",
                "height": 74,
                "high_risk": 1,
                "household_income": "150000",
                "major_condition_aids_hiv": 1,
                "major_condition_alcohol_drug_abuse": 1,
                "major_condition_alzheimers_dementia": 1,
                "major_condition_asthma": 1,
                "major_condition_cancer": 1,
                "major_condition_clinical_depression": 1,
                "major_condition_diabetes": 1,
                "major_condition_emphysema": 1,
                "major_condition_epilepsy": 1,
                "major_condition_heart_attack": 1,
                "major_condition_heart_disease": 1,
                "major_condition_hepatitis_liver": 1,
                "major_condition_high_blood_pressure": 1,
                "major_condition_high_cholesterol": 1,
                "major_condition_kidney_disease": 1,
                "major_condition_mental_illness": 1,
                "major_condition_multiple_sclerosis": 1,
                "major_condition_other": 1,
                "major_condition_pulmonary_disease": 1,
                "major_condition_stroke": 1,
                "major_condition_ulcers": 1,
                "major_condition_vascular_disease": 1,
                "marital_status": "",
                "military": 0,
                "phone": "(229) 942-1111",
                "prescription_medications": "",
                "tobacco": 0,
                "weekly_exercise_hours": "",
                "weight": 193,
                "zip": "90210"
            },
            "type": "life"
        };

        const preparedLead = {
            source: "mediaalpha",
            type: MediaAlphaLead.type,
            empty: 0,
            ...MediaAlphaLead.lead
        };

        client.emit("process-lead", preparedLead);

        await models.Leads.findOne({
            where: {
                email: preparedLead.email
            }
        }).then(() => {
            done();
        });
    });
});
