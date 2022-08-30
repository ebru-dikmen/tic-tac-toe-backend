// import packages
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const fs = require('fs');

// import config
const config = require('./config');

// server port
const port = 3535;

// backend app
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// CORS config
app.use(cors({
  origin: 'http://localhost:4200'
}));

// get data from JSON database
function readFromDatabase() {
  let rawData = fs.readFileSync('data.json');
  return JSON.parse(rawData);
}

// save data to JSON database
function saveToDatabase(database) {
  let rawData = JSON.stringify(database);
  fs.writeFileSync('data.json', rawData);
}

// HTTP POST endpoint to register player
app.post('/register', (req, res) => {

  // check whether request body is valid
  if (req.body && req.body.username && req.body.password) {

    // get the latest data from the database
    let database = readFromDatabase();

    // search whether player already exists
    let player = database.players.find(player => player.username === req.body.username);

    // if player already exists, return HTTP status code 400 (Bad request) with an error message
    if (player) {
      console.log('Registration failed: player already exists.');

      let errorBody = {
        message: 'Player already exists.'
      };

      return res.status(400).send(errorBody);

      // if the player does not exist, save it into the database
    } else {
      // encrypt player password with salt
      let hash = bcrypt.hashSync(req.body.password, config.salt);

      console.log('Registeration success: player is added.');

      // generate UUID as player id
      let userId = uuid.v4();

      let player = {
        id: userId,
        username: req.body.username,
        password: hash
      };

      database.players.push(player);

      // save player into dtabase
      saveToDatabase(database);

      console.log('Login succeed: token is generated.');

      // generate JWT with secret and expire seconds
      var jwtToken = jwt.sign(player, config.secret, {
        expiresIn: config.expire
      });

      let successBody = {
        id: player.id,
        token: jwtToken
      };

      return res.status(200).send(successBody);
    }
    // if the request body is not valid, return HTTP status code 400 (Bad request) with an error message
  } else {
    console.log('Registration failed: request is not valid.');

    let errorBody = {
      message: 'Request is not valid.'
    };

    return res.status(400).send(errorBody);
  }
});

// HTTP POST endpoint to login player
app.post('/login', (req, res) => {

  // check whether request body is valid
  if (req.body && req.body.username && req.body.password) {

    // get the latest data from the database
    let database = readFromDatabase();

    // search whether player already exists
    let player = database.players.find(player => player.username === req.body.username);

    if (player) {
      // compare request password and player password
      let validPassword = bcrypt.compareSync(req.body.password, player.password);

      // if request password and player password are matched, return HTTP status code 200 (Success)
      if (validPassword) {
        console.log('Login succeed: token is generated.');

        // generate JWT with secret and expire
        var jwtToken = jwt.sign(player, config.secret, {
          expiresIn: config.expire
        });

        let successBody = {
          id: player.id,
          token: jwtToken
        };

        return res.status(200).send(successBody);

        // if the request password and player password are not matched, return HTTP status code 401 (Unauthorized) with an error message
      } else {
        console.log('Login failed: password does not match.');

        let errorBody = {
          message: 'Password does not match.'
        };

        return res.status(401).send(errorBody);
      }

      // if the player does not already exist, return HTTP status code 401 (Unauthorized) with an error message
    } else {
      console.log('Login failed: player does not exist.');

      let errorBody = {
        message: 'Player does not exist.'
      };

      return res.status(401).send(errorBody);
    }

    // if the request body is not valid, return HTTP status code 400 (Bad request) with an error message
  } else {
    console.log('Login failed: request is not valid.');

    let errorBody = {
      message: 'Request is not valid.'
    };

    return res.status(400).send(errorBody);
  }
});

// listen HTTP requests on server port
app.listen(port, () => console.log(`Server is listening on port ${port}!`))
