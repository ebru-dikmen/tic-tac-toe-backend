// import packages
const chai = require('chai');
const chaiHttp = require('chai-http');
const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const fs = require('fs');

// import config
const config = require('../config');

// get data from JSON database
let rawData = fs.readFileSync('data.json');
let database = JSON.parse(rawData);

let should = chai.should();

// test framework
chai.use(chaiHttp);

// remove data from JSON database
function cleanDatabase() {
    database.players = [];

    let rawData = JSON.stringify(database);
    fs.writeFileSync('data.json', rawData);
}

// tests for player
describe('Player', () => {

    // tests for a player to login
    describe('Login Player', () => {

        // clean database before all tests
        before((done) => {
            cleanDatabase();
            done();
        });

        // clean database after all tests
        after((done) => {
            cleanDatabase();
            done();
        });

        // clean database before each test
        beforeEach((done) => {
            cleanDatabase();
            done();
        });

        // clean database after each test
        afterEach((done) => {
            cleanDatabase();
            done();
        });

        // tests
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

    // tests for a player to register
    describe('Register Player', () => {

        // clean database before all tests
        before((done) => {
            cleanDatabase();
            done();
        });

        // clean database after all tests
        after((done) => {
            cleanDatabase();
            done();
        });

        // clean database before each test
        beforeEach((done) => {
            cleanDatabase();
            done();
        });

        // clean database after each test
        afterEach((done) => {
            cleanDatabase();
            done();
        });

        // tests
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
