const bcrypt = require('bcryptjs');

const config = {
    salt: '$2a$12$Cyf/.qgGzFFK1lkACJQWb.', // bcrypt.genSaltSync(12)
    secret: '12345!ebru.6789',
    expire: 1800 // 30 minutes
};

module.exports = config;
