'use strict';

const http = require('http');
const express = require('express');
const db = require('./app/database/models/index');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

//  Cors 
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
const recordRoutes = require('./routes/record');
const callRoutes = require('./routes/call');

app.use('/api/records', recordRoutes);
app.use('/api/call', callRoutes);

// Start server
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, async () => {
    console.log(`Server listening on port: ${port}`);

    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});

module.exports = app;

