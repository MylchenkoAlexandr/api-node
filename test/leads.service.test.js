const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');
const LeadService = require('../app/services/lead.service.js')

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

    describe('Process Lead', () => {
        it('Should create new lead record in DB', done => {
            const lead = {
                source_id: 2,
                type_id: 2,
                email: 'mmouse@gmail.com',
                phone: '(229)942-1111',
                state_id: 5,
                status_id: 1,
                fullname: 'Micky Mouse',
                empty: 0,
                property: {
                    address: '120 Jenkins Rd',
                    address_2: '',
                    birth_date: '1970-05-19',
                    coverage_amount: '500000',
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
                        [
                            '1',
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
                            '21'
                        ],
                    term: '20',
                    rate_class: 's'
                }
            };

            const expectedLead = {
                user_id: null,
                state_id: 5,
                phone: '(229)942-1111',
                empty: 0,
                fullname: 'Micky Mouse',
                fname: null,
                lname: null,
                email: 'mmouse@gmail.com',
                busy: 0,
                status: 'new',
                status_title: 'New',
                state: 'CA',
                price:
                {
                    mutual_omaha_express: 0,
                    foresters_express: 0,
                    sagicor_express_issue: 147.16,
                    american_general: 98.51
                },
                source: 'mediaalpha',
                address: '120 Jenkins Rd',
                address_2: '',
                birth_date: '1970-05-19',
                coverage_amount: '500000',
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
                medications:
                    [
                        '1',
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
                        '21'
                    ],
                term: '20',
                rate_class: 's'
            };

            LeadService.createLead(lead, 'ninjaQuoter').then(res => {
                let createdLead = res;
                delete createdLead.id;
                delete createdLead.created;

                expect(createdLead).to.be.an('object');
                expect(JSON.stringify(createdLead)).to.equal(JSON.stringify(expectedLead));
                done();
            }).catch(err => done(err));
        });
    });
});
