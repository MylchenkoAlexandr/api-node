'use strict';

const http = require('http');
const express = require('express');
const db = require('./database/models/index');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

//Variables application
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

//Configuration application
app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes application
app.use('/api/call', require('./routes/call'));
app.use('/api/records', require('./routes/records'));
app.use('/api/lead', require('./routes/lead'));
app.use('/api/mail', require('./routes/mail'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agent', require('./routes/agent'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/beneficiary', require('./routes/beneficiary'));

// Start server
require("./app/lib/sockets")(server); //Socket init

server.listen(PORT, async () => {
    console.log(`Server listening on port: ${PORT}`);

    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

module.exports = app;
