'use strict';

const http = require('http');
const path = require('path');
const express = require('express');
const db = require('./database/models');
const app = express();
const cors = require('cors');
const helmet = require('helmet');

require('dotenv').config();

//Variables application
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const public_dir = path.join(__dirname, 'public');

//Configuration application
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(helmet());

// Routes application
app.use(express.static(public_dir));
app.use('/api/call', require('./routes/call.routes'));
app.use('/api/records', require('./routes/records.routes'));
app.use('/api/lead', require('./routes/lead.routes'));
app.use('/api/mail', require('./routes/mail.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/agents', require('./routes/agent.routes'));
app.use('/api/notes', require('./routes/notes.routes'));
app.use('/api/beneficiary', require('./routes/beneficiary.routes'));
app.use('/api/twilio', require('./routes/twilio.routes'));

app.use('*', (req, res) => {
    res.sendStatus(404);
});

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
