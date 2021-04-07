'use strict';
const mysqldump = require('mysqldump');

const http = require('http');
const path = require('path');
const express = require('express');
const db = require('./database/models');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const cron = require('node-cron');
const CronService = require('./app/cron/cron.service');

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
app.use('/api/beneficiaries', require('./routes/beneficiary.routes'));
app.use('/api/twilio', require('./routes/twilio.routes'));
app.use('/api/user', require('./routes/user.routes'));
app.use('/api/autodialler', require('./routes/autodialler.routes'));
app.use('/api/settings', require('./routes/settings.routes'));
app.use('/api/state', require('./routes/state.routes'));
app.use('/api/phone', require('./routes/phone.routes'));
app.use('/api/status', require('./routes/status.routes'));
app.use('/api/source', require('./routes/source.routes'));
app.use('/api/message', require('./routes/messages.routes'));
app.use('/api/voicemail', require('./routes/voicemails.routes'));
app.use('/api/conference', require('./routes/conference.routes'));
app.use('/api/notifications', require('./routes/notifications.routes'));
app.use('/api/templates', require('./routes/templates.routes'));
app.use('/api/followup', require('./routes/followup.routes'));
app.use('/api/statistic', require('./routes/statistic.routes'));
app.use('/api/telcast', require('./routes/telcast.routes'));

app.use('*', (req, res) => {
    res.sendStatus(404);
});

cron.schedule("* * * * *", async () => {
    await CronService.followUpsNotification();
});

cron.schedule("59 1 * * *", async () => {
    if (process.env.WEBSOCKET_URL == "https://api.joinblueberry.com") {
        mysqldump({
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME
            },
            dumpToFile: '/var/www/dumps/' + new Date() + '.sql',
        });
    }
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
