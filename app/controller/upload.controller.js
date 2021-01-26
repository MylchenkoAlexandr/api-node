const csvToJson = require('convert-csv-to-json');
const formidable = require('formidable');
const FormatService = require('../services/format.service');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const FileHelper = require('../helpers/file.helper');
const models = require('../../database/models');
const SettingsService = require('../services/settings.service');
const fs = require('fs');

class UploadController {
    async uploadCSV(req, res) {
        try {
            const form = new formidable.IncomingForm();

            const rawLeads = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) return reject(err);

                    const delimiter = fields.delimiter;
                    const result = csvToJson.fieldDelimiter(delimiter).formatValueByType().getJsonFromCsv(files["file"].path);
                    resolve(result);
                });
            });

            if (rawLeads) {
                Object.keys(rawLeads).forEach(index => {
                    let preparedRawLead = FormatService.formatRawLead(rawLeads[index], "bulk", "life");
                    client.emit("process-lead", preparedRawLead);
                });

                res.status(200).json({ status: "success", message: "Success parsed CSV file into system" });
            }
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }

    async uploadVoiceMailAudio(req, res) {
        try {
            const form = new formidable.IncomingForm();

            if (form) {
                const newpath = await new Promise((resolve, reject) => {
                    form.parse(req, (err, fields, files) => {
                        if (err) return reject(err);

                        if (files.audio && fields.user_id) {
                            const oldPath = files.audio.path;
                            fs.readFile(oldPath, function (err, data) {
                                if (err) throw err;

                                let path = 'voice_mails/' + (+new Date()) + '_' + fields.user_id + '.mp3';

                                fs.writeFile('public/' + path, data, async function (err) {
                                    if (err) throw err;

                                    const user = await models.Users.findOne({
                                        where: { id: fields.user_id }
                                    });

                                    let existVoiceMail;

                                    if (user.role_id == 2) {
                                        if (user.voice_mail) existVoiceMail = './public/' + user.voice_mail;

                                        await user.update({
                                            voice_mail: path
                                        }).then(() => {
                                            if (existVoiceMail) fs.unlinkSync(existVoiceMail);
                                        });
                                    } else if (user.role_id == 1) {
                                        const settings = await SettingsService.get();

                                        if (settings.default_voice_mail) existVoiceMail = './public/' + settings.default_voice_mail;

                                        await settings.update({
                                            default_voice_mail: path
                                        }).then(() => { if (existVoiceMail) fs.unlink(existVoiceMail); });
                                    }
                                });

                                fs.copyFile('public/' + path, process.env.VM_CUSTOM_PATH + path, (err) => {
                                    if (err) throw err;
                                });

                                fs.unlink(oldPath, function (err) {
                                    if (err) throw err;
                                });

                                resolve(path);
                            });
                        }
                    });
                });

                if (newpath) {
                    return res.status(200).json({ status: 'success', message: "Record upload success!", url: newpath });
                }
            }
            return res.status(400).json({ status: 'error', message: "Bad request!" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new UploadController;