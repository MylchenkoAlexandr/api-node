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

    describe('GET /api/agents', () => {
        it('Should return for admin account an agents array and status code 200', done => {
            chai.request(app)
                .get('/api/agents')
                .set('Authorization', 'Bearer ' + admin_token)
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.agents).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return for agent account a status code 401 and status error', done => {
            chai.request(app)
                .get('/api/agents')
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
                .get('/api/agents')
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
                .get('/api/agents')
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('POST /api/agents/suitable', () => {
        it('Should return for admin account an agents array and status code 200', done => {
            chai.request(app)
                .post('/api/agents/suitable')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({ state_id: 1 })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.agents).to.be.an('array');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return for admin account a status code 400 and status error if client send bad data', done => {
            chai.request(app)
                .post('/api/agents/suitable')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({ state_code: 1 })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                })
        });
        it('Should return for agent account a status code 401 and status error', done => {
            chai.request(app)
                .post('/api/agents/suitable')
                .set('Authorization', 'Bearer ' + agent_token)
                .send({ state_id: 1 })
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
                .post('/api/agents/suitable')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .send({ state_id: 1 })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .post('/api/agents/suitable')
                .send({ state_id: 1 })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('POST /api/agents/create', () => {
        // it('Should return for admin account a status code 201 and status success if user created', done => {
        //     chai.request(app)
        //         .post('/api/agents/create')
        //         .set('Authorization', 'Bearer ' + admin_token)
        //         .send({
        //             fname: "Test",
        //             lname: "Agent",
        //             email: "test@agent.com",
        //             password: "password",
        //             states: ["AL", "AK"],
        //         })
        //         .end((err, res) => {
        //             if (err) done(err);
        //             expect(res).to.have.status(201);
        //             expect(res).to.be.an('object');
        //             expect(res.body.status).to.deep.equals('success');
        //             done();
        //         })
        // });
        it('Should return for admin account a status code 409 and status error if user exist', done => {
            chai.request(app)
                .post('/api/agents/create')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent@t.com",
                    password: "password",
                    states: "['CA']",
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(409);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                })
        });
        it('Should return for admin account a status code 400 and status error if client send bad data', done => {
            chai.request(app)
                .post('/api/agents/create')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({
                    fname: "Agent",
                    email: "agent@t.com",
                    password: "password",
                    states: "['CA']",
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return for agent account a status code 401 and status error', done => {
            chai.request(app)
                .post('/api/agents/create')
                .set('Authorization', 'Bearer ' + agent_token)
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent@t.com",
                    password: "password",
                    states: "['CA']",
                })
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
                .post('/api/agents/create')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent@t.com",
                    password: "password",
                    states: "['CA']",
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .post('/api/agents/create')
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent@t.com",
                    password: "password",
                    states: "['CA']",
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('PUT /api/agents/:agent_id', () => {
        it('Should return for admin account a status code 200 and status success if user exist and updated', done => {
            chai.request(app)
                .put('/api/agents/3')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent2@t.com",
                    password: "password",
                    states: ["AL", "AK", "CA"],
                    banned: false
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return for admin account a status code 409 and status error if user not exist', done => {
            chai.request(app)
                .put('/api/agents/123')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent2@t.com",
                    password: "password",
                    states: ["AL", "AK", "CA"],
                    banned: false
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(409);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                })
        });
        it('Should return for admin account a status code 400 and status error if client send bad data', done => {
            chai.request(app)
                .put('/api/agents/3')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({
                    fname: "Agent",
                    email: "agent@t.com",
                    password: "password",
                    states: "['CA']",
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return for agent account a status code 401 and status error', done => {
            chai.request(app)
                .put('/api/agents/3')
                .set('Authorization', 'Bearer ' + agent_token)
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent2@t.com",
                    password: "password",
                    states: ["AL", "AK", "CA"],
                    banned: false
                })
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
                .put('/api/agents/3')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent2@t.com",
                    password: "password",
                    states: ["AL", "AK", "CA"],
                    banned: false
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .put('/api/agents/3')
                .send({
                    fname: "Agent",
                    lname: "Agent",
                    email: "agent2@t.com",
                    password: "password",
                    states: ["AL", "AK", "CA"],
                    banned: false
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });

    describe('PUT /api/agents/password/:agent_id', () => {
        it('Should return a status code 200 and status success', done => {
            chai.request(app)
                .put('/api/agents/password/3')
                .set('Authorization', 'Bearer ' + agent_token)
                .send({
                    old_password: "password",
                    new_password: "password"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(200);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('success');
                    done();
                })
        });
        it('Should return a status code 409 and status error if old password is wrong', done => {
            chai.request(app)
                .put('/api/agents/password/3')
                .set('Authorization', 'Bearer ' + agent_token)
                .send({
                    old_password: "password_wrong",
                    new_password: "password"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(409);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                })
        });
        it('Should return a status code 409 and status error if user not exist', done => {
            chai.request(app)
                .put('/api/agents/password/123')
                .set('Authorization', 'Bearer ' + agent_token)
                .send({
                    old_password: "password",
                    new_password: "password"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(409);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                })
        });
        it('Should return a status code 400 and status error if client send bad data', done => {
            chai.request(app)
                .put('/api/agents/3')
                .set('Authorization', 'Bearer ' + admin_token)
                .send({
                    password: "password",
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(400);
                    expect(res).to.be.an('object');
                    expect(res.body.status).to.deep.equals('error');
                    done();
                });
        });
        it('Should return a status code 403 if user not authenticated', done => {
            chai.request(app)
                .put('/api/agents/3')
                .set('Authorization', 'Bearer ' + '12&dsaad123dasda123as')
                .send({
                    old_password: "password",
                    new_password: "password"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(403);
                    expect(res).to.be.an('object');
                    done();
                });
        });
        it('Should return a status code 401 if there is no token', done => {
            chai.request(app)
                .put('/api/agents/3')
                .send({
                    old_password: "password",
                    new_password: "password"
                })
                .end((err, res) => {
                    if (err) done(err);
                    expect(res).to.have.status(401);
                    expect(res).to.be.an('object');
                    done();
                });
        });
    });
});