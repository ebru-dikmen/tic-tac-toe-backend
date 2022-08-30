const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const fs = require('fs');

const config = require('./config');

const port = 3535;

const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

function readFromDatabase() {
  let rawData = fs.readFileSync('data.json');
  return JSON.parse(rawData);
}

function saveToDatabase(database) {
  let rawData = JSON.stringify(database);
  fs.writeFileSync('data.json', rawData);
}

app.post('/register', (req, res) => {

  if (req.body && req.body.username && req.body.password) {

    let database = readFromDatabase();

    let player = database.players.find(player => player.username === req.body.username);

    if (player) {
      console.log('Registeration failed: player already exists.');

      let errorBody = {
        message: 'Player already exists.'
      };

      return res.status(400).send(errorBody);
    } else {
      let hash = bcrypt.hashSync(req.body.password, config.salt);

      console.log('Registeration success: player is added.');

      let userId = uuid.v4();

      let player = {
        id: userId,
        username: req.body.username,
        password: hash
      };

      database.players.push(player);

      saveToDatabase(database);

      console.log('Login succeed: token is generated.');

      var jwtToken = jwt.sign(player, config.secret, {
        expiresIn: config.expire
      });

      let successBody = {
        id: player.id,
        token: jwtToken
      };

      return res.status(200).send(successBody);
    }
  } else {
    console.log('Registeration failed: request is not valid.');

    let errorBody = {
      message: 'Request is not valid.'
    };

    return res.status(400).send(errorBody);
  }
});

app.post('/login', (req, res) => {

  if (req.body && req.body.username && req.body.password) {

    let database = readFromDatabase();

    let player = database.players.find(player => player.username === req.body.username);

    if (player) {
      let validPassword = bcrypt.compareSync(req.body.password, player.password);

      if (validPassword) {
        console.log('Login succeed: token is generated.');

        var jwtToken = jwt.sign(player, config.secret, {
          expiresIn: config.expire
        });

        let successBody = {
          id: player.id,
          token: jwtToken
        };

        return res.status(200).send(successBody);
      } else {
        console.log('Login failed: password does not match.');

        let errorBody = {
          message: 'Password does not match.'
        };

        return res.status(401).send(errorBody);
      }

    } else {
      console.log('Login failed: player does not exist.');

      let errorBody = {
        message: 'Player does not exist.'
      };

      return res.status(401).send(errorBody);
    }

  } else {
    console.log('Login failed: request is not valid.');

    let errorBody = {
      message: 'Request is not valid.'
    };

    return res.status(400).send(errorBody);
  }
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`))
