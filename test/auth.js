const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const fs = require('fs');

const config = require('../config');

let rawData = fs.readFileSync('data.json');
let database = JSON.parse(rawData);

let should = chai.should();

chai.use(chaiHttp);

function cleanDatabase() {
    database.players = [];

    let rawData = JSON.stringify(database);
    fs.writeFileSync('data.json', rawData);
}

describe('Player', () => {

    describe('Login Player', () => {

        before((done) => {
            cleanDatabase();

            done();
        });

        after((done) => {
            cleanDatabase();

            done();
        });

        beforeEach((done) => {
            cleanDatabase();

            done();
        });

        afterEach((done) => {
            cleanDatabase();

            done();
        });

        it('it should POST a player for login', (done) => {
            let player = {
                username: 'john',
                password: '12345'
            };

            let playerInDatabase = {
                id: uuid.v4(),
                username: player.username,
                password: bcrypt.hashSync(player.password, config.salt)
            };

            database.players = [
                playerInDatabase
            ];

            let rawData = JSON.stringify(database);
            fs.writeFileSync('data.json', rawData);

            chai.request('http://127.0.0.1:3535')
                .post('/login')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    res.body.should.have.property('id');
                    done();
                });
        });

        it('it should not POST a player for login-1', (done) => {
            chai.request('http://127.0.0.1:3535')
                .post('/login')
                .send(null)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Request is not valid.');
                    done();
                });
        });

        it('it should not POST a player for login-2', (done) => {
            let player = {
                username: 'john'
            }

            chai.request('http://127.0.0.1:3535')
                .post('/login')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Request is not valid.');
                    done();
                });
        });

        it('it should not POST a player for login-3', (done) => {
            let player = {
                password: '12345'
            }

            chai.request('http://127.0.0.1:3535')
                .post('/login')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Request is not valid.');
                    done();
                });
        });

        it('it should not POST a player for login-4', (done) => {
            let player = {
                username: 'john',
                password: '12345'
            };

            let playerInDatabase = {
                id: uuid.v4(),
                username: player.username,
                password: bcrypt.hashSync(player.password, config.salt)
            };

            database.players = [
                playerInDatabase
            ];

            let rawData = JSON.stringify(database);
            fs.writeFileSync('data.json', rawData);

            let playerWithWrongPassword = {
                username: 'john',
                password: '98765'
            };

            chai.request('http://127.0.0.1:3535')
                .post('/login')
                .send(playerWithWrongPassword)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql('Password does not match.');
                    done();
                });
        });
    });

    describe('Register Player', () => {

        before((done) => {
            cleanDatabase();

            done();
        });

        after((done) => {
            cleanDatabase();

            done();
        });

        beforeEach((done) => {
            cleanDatabase();

            done();
        });

        afterEach((done) => {
            cleanDatabase();

            done();
        });

        it('it should POST a player for register', (done) => {
            let player = {
                username: 'john',
                password: '12345'
            }

            chai.request('http://127.0.0.1:3535')
                .post('/register')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.have.property('token');
                    res.body.should.have.property('id');
                    done();
                });
        });

        it('it should not POST a player for register-1', (done) => {
            let player = {
                username: 'john'
            };

            chai.request('http://127.0.0.1:3535')
                .post('/register')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Request is not valid.');
                    done();
                });
        });

        it('it should not POST a player for register-2', (done) => {
            let player = {
                password: '12345'
            };

            chai.request('http://127.0.0.1:3535')
                .post('/register')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Request is not valid.');
                    done();
                });
        });

        it('it should not POST a player for register-3', (done) => {
            chai.request('http://127.0.0.1:3535')
                .post('/register')
                .send(null)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Request is not valid.');
                    done();
                });
        });

        it('it should not POST a player for register-4', (done) => {
            let player = {
                username: 'john',
                password: '12345'
            };

            let playerInDatabase = {
                id: uuid.v4(),
                username: player.username,
                password: bcrypt.hashSync(player.password, config.salt)
            };

            database.players = [
                playerInDatabase
            ];

            let rawData = JSON.stringify(database);
            fs.writeFileSync('data.json', rawData);

            chai.request('http://127.0.0.1:3535')
                .post('/register')
                .send(player)
                .end((err, res) => {
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.should.have.property('message').eql('Player already exists.');
                    done();
                });
        });
    })
});
