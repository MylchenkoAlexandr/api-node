const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');

chai.use(chaiHttp);

describe('Notes routes', () => {
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

    describe('POST /api/notes/get', () => {
        it('Should return 401 code if there is no token', done => {
            chai.request(app)
                .post('/api/notes/get')
                .send({
                    lead_id: 1
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    done();
                })
        });
        it('Should return an array of all the notes with lead id', done => {
            chai.request(app)
                .post('/api/notes/get')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    lead_id: 1
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.notes).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                });
        });
        it('Should return error status and 400 code if there is no req values', done => {
            chai.request(app)
                .post('/api/notes/get')
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
    describe('POST /api/notes/create', () => {
        it('Should return 401 code if there is no token', done => {
            chai.request(app)
                .post('/api/notes/create')
                .send({
                    user_id: 1,
                    lead_id: 1,
                    message: 'The test note'
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    done();
                })
        });
        it('Should return an object of note', done => {
            chai.request(app)
                .post('/api/notes/create')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    user_id: 1,
                    lead_id: 4,
                    message: 'The test note'
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(201);
                    expect(res).to.be.an('object');
                    expect(res.body.note).to.be.an('object');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                });
        });
        it('Should return error status and 400 code if there is no req values', done => {
            chai.request(app)
                .post('/api/notes/create')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return error status and 400 code if message is empty', done => {
            chai.request(app)
                .post('/api/notes/create')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    user_id: 1,
                    lead_id: 1,
                    message: ''
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
    });
    describe('POST /api/notes/delete', () => {
        it('Should return 401 code if there is no token', done => {
            chai.request(app)
                .post('/api/notes/delete')
                .send({
                    note_id: 1
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    done();
                })
        });
        it('Should return an delete status by note', done => {
            chai.request(app)
                .post('/api/notes/delete')
                .set('Authorization', 'Bearer ' + token)
                .send({
                    note_id: 1
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.deleted).to.be.an('boolean');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                });
        });
        it('Should return error status and 400 code if there is no req values', done => {
            chai.request(app)
                .post('/api/notes/delete')
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
});