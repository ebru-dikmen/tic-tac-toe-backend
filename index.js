const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');

const database = {
  players: []
};

const authenticationConfig = {
  salt: 10,
  secretKey: 'ebru',
  expire: 1800 // 30 minute
};

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

app.post('/register', (req, res) => {
  if (req.body && req.body.username && req.body.password) {
    let player = database.players.find(player => player.username === req.body.username);

    if (player) {
      console.log('Registeration failed: player already exists.');

      let errorBody = {
        message: 'Player already exists.'
      };

      return res.status(400).send(errorBody);
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          console.log('Registration failed: password hashing error.');

          let errorBody = {
            message: err
          };

          return res.status(500).send(errorBody);
        } else {
          console.log('Registeration success: player is added.');

          let playerId = uuid.v4();

          let player = {
            id: playerId,
            username: req.body.username,
            password: hash
          };

          database.players.push(player);

          console.log('Login succeed: token is generated.');

          var jwtToken = jwt.sign(player, authenticationConfig.secretKey, {
            expiresIn: authenticationConfig.expire
          });

          let successBody = {
            id: player.id,
            token: jwtToken
          };

          return res.status(200).send(successBody);
        }
      })
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
    let player = database.players.find(player => player.username === req.body.username);

    if (player) {
      let validPassword = bcrypt.compare(req.body.password, player.password);

      if (validPassword) {
        console.log('Login succeed: token is generated.');

        var jwtToken = jwt.sign(player, authenticationConfig.secretKey, {
          expiresIn: authenticationConfig.expire
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
