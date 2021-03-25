const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');

chai.use(chaiHttp);

describe('Auth routes', () => {
    let token = '';
    before(done => {
        db.sequelize.authenticate()
            .then(() => done())
            .catch(err => done(err));
    });

    describe('POST /api/auth/signin', () => {
        it('Should return 403 code if account has been banned', done => {
            chai.request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'agent@t.com',
                    password: 'password'
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.equal('error')
                    done();
                })
        });
        it('Should return an user object, success status and token', done => {
            chai.request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'admin@t.com',
                    password: 'password'
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.user).to.be.an('object');
                    expect(res.body.token).to.be.an('string');
                    expect(res.body.status).to.deep.equals('success');
                    token = res.body.token
                    done();
                });
        });
        it('Should return a 401 code and error status if there is no email', done => {
            chai.request(app)
                .post('/api/auth/signin')
                .send({
                    password: 'password'
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return a 401 code and error status if there is no password', done => {
            chai.request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'admin@t.com'
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return error status and 400 code if there is no req values', done => {
            chai.request(app)
                .post('/api/auth/signin')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
    });

    describe('POST /api/auth/verify', () => {
        it('Should return an user object and success status', done => {
            chai.request(app)
                .post('/api/auth/verify')
                .send({
                    token: token
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.user).to.be.an('object');
                    expect(res.body.status).to.equal('success');
                    done();
                })
        });
        it('Should return a 403 code and error status if token has been wrong', done => {
            chai.request(app)
                .post('/api/auth/verify')
                .send({
                    token: '&asdsag@qsdqhqwg1233sadh',
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return a 403 code and error status if there is no req values', done => {
            chai.request(app)
                .post('/api/auth/verify')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
    });
});