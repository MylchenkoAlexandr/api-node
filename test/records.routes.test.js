const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');

chai.use(chaiHttp);

describe('Records routes', () => {
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

    describe('POST /api/records/:lead_id', () => {
        it('Should return a records array, 200 status code and success status', done => {
            chai.request(app)
                .get('/api/records/1')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.records).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return a 403 status code and error status if token is wrong', done => {
            chai.request(app)
                .get('/api/records/1')
                .set('Authorization', 'Bearer hgjdashgdsagydgy12')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                })
        });
        it('Should return a 401 status code if token is missing', done => {
            chai.request(app)
                .get('/api/records/1')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                })
        });
    });
});