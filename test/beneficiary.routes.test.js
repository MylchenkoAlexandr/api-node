const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');

chai.use(chaiHttp);

describe('Beneficiary routes', () => {
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

    describe('POST /api/beneficiary/save', () => {
        it('Should return 401 code if there is no token', done => {
            chai.request(app)
                .post('/api/beneficiary/save')
                .send({
                    lead_id: 1,
                    name: 'John',
                    dob: '12/07/1960',
                    relative_id: 4,
                    location_id: 1,
                    grand_kids: null,
                    work_status: "Retired"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    done();
                })
        });
        it('Should return a success status for save beneficiary', done => {
            chai.request(app)
                .post('/api/beneficiary/save')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    lead_id: 1,
                    name: 'John',
                    dob: '12/07/1960',
                    relative_id: 4,
                    location: "AL",
                    grand_kids: null,
                    work_status: "Retired"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                });
        });
        it('Should return a success status for save beneficiary', done => {
            chai.request(app)
                .post('/api/beneficiary/save')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    lead_id: 1,
                    name: 'John',
                    dob: '14/05/1960',
                    relative_id: 4,
                    location: "CA",
                    grand_kids: null,
                    work_status: "On Disability"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                });
        });
        it('Should return error status and 400 code if there is no req values', done => {
            chai.request(app)
                .post('/api/beneficiary/save')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
    });
    describe('GET /api/beneficiary/:lead_id', () => {
        it('Should return 401 code if there is no token', done => {
            chai.request(app)
                .get('/api/beneficiary/1')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    done();
                })
        });
        it('Should return an object of beneficiary', done => {
            chai.request(app)
                .get('/api/beneficiary/1')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.beneficiary).to.be.an('object');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                });
        });
        it('Should return error status and 404 code if params wrong', done => {
            chai.request(app)
                .post('/api/beneficiary/asdasd123123')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(404);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });
});