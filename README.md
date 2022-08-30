# Tic-Tac-Toe
- frontend application: https://github.com/ebru-dikmen/tic-tac-toe-frontend

## General Structure
- Angular Framework (V14.1.3) was used for the Frontend side, and Express.js was used for the Backend side.
- The project consists of Register, Login, and Board pages.
- Firstly, you must register to the system to play a game of Tic Tac Toe.
- After you register to the system, the token is defined for you by the backend side. That duration time is 30 minutes.
- You can log in to the system again using the same password and username. (Session Management)
- Tailwind components are used for UI design.
- The UI design of the game was done using Responsive Design.
- Angular Animation was added for the display of the board better.
- Test-driven Development (TDD) was done with Jasmine and Karma. (Frontend side)
- Test-driven development (TDD) was done with Mocha and Chai. (Backend side)
- Data is kept in a JSON database.
- Passwords are kept encrypted in the JSON database.
- Example requests of REST API  are added into the repository as a Postman collection file. (tic-tac-toe.backend.postman_collection)

## Running Project
You should run these commands on the terminal in order.

- Frontend Side
1. install dependencies
```
npm install
```
2. install Angular CLI
```
npm install -g @angular/cli
```
3. serve the application
```
ng serve
```

- Backend Side
1. install dependencies
```
npm install
```
2. serve the application
```
node index.js
```

## Running unit tests
- Frontend Side
  * You can see the overall coverage of the application on the terminal.
  * Also, you can see coverage of each component after opening "./coverage/index.html".
```
ng test  --code-coverage
```

- Backend Side
1. run backend application
```
node index.js
```

2. run backend tests
```
npm run test
```
