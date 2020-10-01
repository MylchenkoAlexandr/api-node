const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const app = require('../app');
const db = require('../database/models');

chai.use(chaiHttp);

describe('Agents routes', () => {
    let admin_token = '';
    let agent_token = '';

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
                        admin_token = res.body.token;
                        chai.request(app)
                            .post('/api/auth/signin')
                            .send({
                                email: 'agent2@t.com',
                                password: 'password'
                            })
                            .end((err, res) => {
                                if (err) done(err);
                                agent_token = res.body.token;
                                done();
                            });
                    });

            })
            .catch(err => done(err));
    });

    describe('GET /api/lead/raws', () => {
        it('Should return a raw leads array and status code 200', done => {
            chai.request(app)
                .get('/api/lead/raws')
                .set('Authorization', 'Bearer ' + agent_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.rawLeads).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return a status code 403 if user not authenticated', done => {
            chai.request(app)
                .get('/api/lead/raws')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .get('/api/lead/raws')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('GET /api/lead/all/life/1', () => {
        it('Should return a leads array and status code 200', done => {
            chai.request(app)
                .get('/api/lead/all/life/1')
                .set('Authorization', 'Bearer ' + agent_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.leads).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return a status code 403 if user not authenticated', done => {
            chai.request(app)
                .get('/api/lead/all/life/1')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .get('/api/lead/all/life/1')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('GET /api/lead/all/blueberry', () => {
        it('Should return for admin account a blueberry leads array and status code 200', done => {
            chai.request(app)
                .get('/api/lead/all/blueberry')
                .set('Authorization', 'Bearer ' + admin_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.leads).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return for agent account a status code 401 and status error', done => {
            chai.request(app)
                .get('/api/lead/all/blueberry')
                .set('Authorization', 'Bearer ' + agent_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return a status code 403 if user not authenticated', done => {
            chai.request(app)
                .get('/api/lead/all/blueberry')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .get('/api/lead/all/blueberry')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('GET /api/lead/all/media-alpha', () => {
        it('Should return for admin account a media-alpha leads array and status code 200', done => {
            chai.request(app)
                .get('/api/lead/all/media-alpha')
                .set('Authorization', 'Bearer ' + admin_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.leads).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return for agent account a status code 401 and status error', done => {
            chai.request(app)
                .get('/api/lead/all/media-alpha')
                .set('Authorization', 'Bearer ' + agent_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return a status code 403 if user not authenticated', done => {
            chai.request(app)
                .get('/api/lead/all/media-alpha')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .get('/api/lead/all/media-alpha')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    // describe('GET /api/lead/1', () => {
    //     it('Should return for admin account a status code 409 and status error if user exist', done => {
    //         chai.request(app)
    //             .post('/api/lead/1')
    //             .set('Authorization', 'Bearer ' + agent_token)
    //             .send({
    //                 fname: "Agent",
    //                 lname: "Agent",
    //                 email: "agent@t.com",
    //                 password: "password",
    //                 states: "['CA']",
    //             })
    //             .end((err, res) => {
    //                 if (err) done(err);
    //                 expect(res).to.have.status(409);
    //                 expect(res).to.be.an('object');
    //                 expect(res.body.status).to.deep.equals('error');
    //                 done();
    //             })
    //     });
    //     it('Should return a status code 403 if user not authenticated', done => {
    //         chai.request(app)
    //             .get('/api/lead/1')
    //             .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
    //             .end((err, res) => {
    //                 if (err) done(err);
    //                 expect(res).to.have.status(403);
    //                 expect(res).to.be.an('object');
    //                 done();
    //             });
    //     });
    //     it('Should return a status code 401 if there is no token', done => {
    //         chai.request(app)
    //             .get('/api/lead/1')
    //             .end((err, res) => {
    //                 if (err) done(err);
    //                 expect(res).to.have.status(401);
    //                 expect(res).to.be.an('object');
    //                 done();
    //             });
    //     });
    // });


});