const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');
const LeadService = require('../app/services/lead.service.js')
const FormatService = require('../app/services/format.service.js')

chai.use(chaiHttp);

describe('LeadsService', () => {
    let token = '';

    before(done => {
        db.sequelize.authenticate()
            .then(() => {
                chai.request(app)
                    .post('/api/auth/signin')
                    .send({
                        email: 'admin@t.com',
                        password: 'password'
                    })
                    .end((err, res) => {
                        if (err) done(err);
                        token = res.body.token;
                        done();
                    });
            })
            .catch(err => done(err));
    });

    const leadMediaAlpha = {
        "address": "120 Jenkins Rd",
        "address_2": "",
        "birth_date": "1970-05-19",
        "contact": "Micky Mouse",
        "coverage_amount": "150000",
        "coverage_type": "Term 10 Years",
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
        "zip": "90210",
        "type": "life",
        "source": "mediaalpha",
        "empty": 0,
    }

    let formatedLead = {};

    const expectedLead = {
        source_id: 2,
        type_id: 2,
        email: 'mmouse@gmail.com',
        phone: '(229)942-1111',
        state_id: 5,
        status_id: 1,
        fullname: 'Micky Mouse',
        empty: 0,
        property:
        {
            address: '120 Jenkins Rd',
            address_2: '',
            birth_date: '1970-05-19',
            coverage_amount: '150000',
            credit_rating: '',
            current_company: 'Other',
            currently_insured: 1,
            dui: 1,
            gender: 'F',
            height: 74,
            high_risk: 1,
            household_income: '150000',
            marital_status: '',
            military: 0,
            prescription_medications: '',
            tobacco: 0,
            weekly_exercise_hours: '',
            weight: 193,
            zipcode: '90210',
            state: 'CA',
            medications:
                ['1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '16',
                    '17',
                    '22',
                    '18',
                    '19',
                    '20',
                    '21'],
            term: '10',
            rate_class: 's'
        }
    };

    const expectedCreatedLead = { "user_id": null, "state_id": 5, "phone": "(229)942-1111", "empty": 0, "fullname": "Micky Mouse", "fname": null, "lname": null, "email": "mmouse@gmail.com", "busy": 0, "status": "new", "status_title": "New", "state": "CA", "price": { "mutual_omaha_express": 59.54, "foresters_express": 39.33, "sagicor_express_issue": 30.13, "american_general": 31.85 }, "source": "mediaalpha", "address": "120 Jenkins Rd", "address_2": "", "birth_date": "1970-05-19", "coverage_amount": "150000", "credit_rating": "", "current_company": "Other", "currently_insured": 1, "dui": 1, "gender": "F", "height": 74, "high_risk": 1, "household_income": "150000", "marital_status": "", "military": 0, "prescription_medications": "", "tobacco": 0, "weekly_exercise_hours": "", "weight": 193, "zipcode": "90210", "medications": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "16", "17", "22", "18", "19", "20", "21"], "term": "10", "rate_class": "s" };

    describe('FormatServic@formatLead', () => {
        it('Should properly format the lead', done => {
            FormatService.formatLead(leadMediaAlpha).then(res => {
                formatedLead = res;
                expect(formatedLead).to.be.an('object');
                expect(JSON.stringify(formatedLead)).to.equal(JSON.stringify(expectedLead));
                done();
            }).catch(err => done(err));
        });
    });

    describe('Process Lead', () => {
        it('Should create new lead record in DB', done => {
            LeadService.createLead(formatedLead, 'ninjaQuoter').then(res => {
                let createdLead = res;

                delete createdLead.id;
                delete createdLead.created;

                expect(createdLead).to.be.an('object');
                expect(JSON.stringify(createdLead)).to.equal(JSON.stringify(expectedCreatedLead));
                done();
            }).catch(err => done(err));
        });
    });
});
